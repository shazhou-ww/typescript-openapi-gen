import { routePathToFsPath, getPathMethods } from '../openapi-parser.js'
import type { OpenAPIDocument } from '../openapi-parser.js'
import type { OperationObject } from '../shared/openapi-types.js'
import type { RouteInfo } from './types.js'

/**
 * Build a hierarchical tree of routes from the OpenAPI paths
 */
export function buildRouteTree(doc: OpenAPIDocument): Map<string, RouteInfo> {
  const tree = new Map<string, RouteInfo>()
  const paths = doc.paths || {}

  for (const [routePath, pathItem] of Object.entries(paths)) {
    if (!pathItem) continue
    addRouteToTree(tree, routePath, pathItem)
  }

  return tree
}

function addRouteToTree(
  tree: Map<string, RouteInfo>,
  routePath: string,
  pathItem: object,
): void {
  const segments = routePath.split('/').filter(Boolean)
  let current = tree

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i]
    const partialPath = '/' + segments.slice(0, i + 1).join('/')

    if (!current.has(segment)) {
      current.set(segment, createRouteInfo(partialPath))
    }

    const node = current.get(segment)!

    if (i === segments.length - 1) {
      addMethodsToNode(node, pathItem)
    }

    current = node.children
  }
}

function createRouteInfo(partialPath: string): RouteInfo {
  return {
    path: partialPath,
    fsPath: routePathToFsPath(partialPath),
    methods: new Map(),
    children: new Map(),
  }
}

function addMethodsToNode(node: RouteInfo, pathItem: object): void {
  for (const method of getPathMethods(pathItem)) {
    const operation = (pathItem as Record<string, unknown>)[
      method
    ] as OperationObject
    if (operation) {
      node.methods.set(method, operation)
    }
  }
}
