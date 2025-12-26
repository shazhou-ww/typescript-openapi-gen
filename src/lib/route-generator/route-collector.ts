import { getPathMethods, isSSEOperation } from '../openapi-parser.js'
import type { OpenAPIDocument } from '../openapi-parser.js'
import type { OperationObject } from '../shared/openapi-types.js'
import { capitalize } from '../shared/codegen-utils.js'
import type { FlatRoute } from './types.js'

// HTTP method order for sorting
const METHOD_ORDER = ['get', 'post', 'put', 'patch', 'delete', 'options', 'head']

/**
 * Collect all routes from OpenAPI document as a flat list, sorted by path and method
 */
export function collectRoutes(doc: OpenAPIDocument): FlatRoute[] {
  const routes: FlatRoute[] = []
  const paths = doc.paths || {}

  for (const [routePath, pathItem] of Object.entries(paths)) {
    if (!pathItem) continue

    for (const method of getPathMethods(pathItem)) {
      const operation = (pathItem as Record<string, unknown>)[
        method
      ] as OperationObject
      if (!operation) continue

      routes.push(createFlatRoute(routePath, method, operation))
    }
  }

  // Sort by path first, then by method
  return routes.sort((a, b) => {
    const pathCompare = a.path.localeCompare(b.path)
    if (pathCompare !== 0) return pathCompare
    return METHOD_ORDER.indexOf(a.method) - METHOD_ORDER.indexOf(b.method)
  })
}

function getReturnType(operation: OperationObject): string {
  const responses = operation.responses
  if (!responses) return 'void'

  // Check for 204 No Content response
  if ('204' in responses) return 'void'

  // Check for default response
  if ('default' in responses) {
    const response = responses.default as any
    if (response.content) return 'unknown' // Has content but unknown type
    return 'void'
  }

  // Check for 200 response
  if ('200' in responses) {
    const response = responses['200'] as any
    if (response.content) return 'unknown' // Has content but unknown type
    return 'void'
  }

  return 'void'
}

function createFlatRoute(
  routePath: string,
  method: string,
  operation: OperationObject,
): FlatRoute {
  const returnType = getReturnType(operation)

  return {
    path: routePath,
    elysiaPath: convertToElysiaPath(routePath),
    method,
    operation,
    controllerImportPath: getControllerImportPath(routePath),
    handlerName: `handle${capitalize(method)}`,
    returnType,
  }
}

/**
 * Convert OpenAPI path to Elysia path format
 * e.g., "/pets/{petId}" => "/pets/:petId"
 */
function convertToElysiaPath(routePath: string): string {
  return routePath.replace(/\{([^}]+)\}/g, ':$1')
}

/**
 * Get controller import path segments
 * e.g., "/pets/{petId}/photos" => ["pets", "_petId", "photos"]
 */
function getControllerImportPath(routePath: string): string[] {
  return routePath
    .split('/')
    .filter(Boolean)
    .map((segment) => {
      const match = segment.match(/^\{(.+)\}$/)
      return match ? `_${match[1]}` : segment
    })
}

/**
 * Check if a route is an SSE endpoint
 */
export function isSSERoute(route: FlatRoute): boolean {
  return isSSEOperation(route.operation)
}
