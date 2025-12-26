import * as fs from 'node:fs'
import * as path from 'node:path'
import * as yaml from 'js-yaml'
import type { OpenAPIV3, OpenAPIV3_1 } from 'openapi-types'

export type OpenAPIDocument = OpenAPIV3.Document | OpenAPIV3_1.Document

/**
 * Parse an OpenAPI specification file (YAML or JSON)
 */
export async function parseOpenAPIFile(filePath: string): Promise<OpenAPIDocument> {
  const absolutePath = path.resolve(filePath)
  const content = fs.readFileSync(absolutePath, 'utf-8')
  const ext = path.extname(filePath).toLowerCase()

  let doc: unknown

  if (ext === '.yaml' || ext === '.yml') {
    doc = yaml.load(content)
  } else if (ext === '.json') {
    doc = JSON.parse(content)
  } else {
    // Try to parse as YAML first (it's a superset of JSON)
    try {
      doc = yaml.load(content)
    } catch {
      doc = JSON.parse(content)
    }
  }

  // Basic validation
  if (!doc || typeof doc !== 'object') {
    throw new Error('Invalid OpenAPI document: not an object')
  }

  const docObj = doc as Record<string, unknown>

  if (!docObj['openapi'] && !docObj['swagger']) {
    throw new Error('Invalid OpenAPI document: missing openapi or swagger version field')
  }

  if (!docObj['paths']) {
    throw new Error('Invalid OpenAPI document: missing paths field')
  }

  return doc as OpenAPIDocument
}

/**
 * Extract path parameters from a route path
 * e.g., "/users/{userId}/posts/{postId}" => ["userId", "postId"]
 */
export function extractPathParams(routePath: string): string[] {
  const paramRegex = /\{([^}]+)\}/g
  const params: string[] = []
  let match: RegExpExecArray | null

  while ((match = paramRegex.exec(routePath)) !== null) {
    params.push(match[1])
  }

  return params
}

/**
 * Convert a route path to a file system path
 * e.g., "/users/{userId}/profile" => "users/_userId/profile"
 */
export function routePathToFsPath(routePath: string): string {
  return routePath
    .split('/')
    .filter(Boolean)
    .map(segment => {
      // Convert {paramName} to _paramName
      const paramMatch = segment.match(/^\{(.+)\}$/)
      if (paramMatch) {
        return `_${paramMatch[1]}`
      }
      return segment
    })
    .join('/')
}

/**
 * Get the HTTP methods defined for a path item
 */
export function getPathMethods(pathItem: OpenAPIV3.PathItemObject | OpenAPIV3_1.PathItemObject): string[] {
  const httpMethods = ['get', 'post', 'put', 'delete', 'patch', 'options', 'head', 'trace']
  return httpMethods.filter(method => method in pathItem)
}

/**
 * Check if an operation supports SSE (Server-Sent Events)
 */
export function isSSEOperation(operation: OpenAPIV3.OperationObject | OpenAPIV3_1.OperationObject): boolean {
  const responses = operation.responses
  if (!responses) return false

  // Check for text/event-stream content type in responses
  for (const response of Object.values(responses)) {
    if ('content' in response && response.content) {
      if ('text/event-stream' in response.content) {
        return true
      }
    }
  }

  return false
}

/**
 * Get the reference name from a $ref string
 * e.g., "#/components/schemas/User" => "User"
 */
export function getRefName(ref: string): string {
  const parts = ref.split('/')
  return parts[parts.length - 1]
}

/**
 * Check if a value is a reference object
 */
export function isReferenceObject(obj: unknown): obj is OpenAPIV3.ReferenceObject {
  return typeof obj === 'object' && obj !== null && '$ref' in obj
}

