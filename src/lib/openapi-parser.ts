import * as fs from 'node:fs'
import * as path from 'node:path'
import * as yaml from 'js-yaml'
import type { OpenAPIV3, OpenAPIV3_1 } from 'openapi-types'

export type OpenAPIDocument = OpenAPIV3.Document | OpenAPIV3_1.Document

/**
 * Parse an OpenAPI specification file (YAML or JSON)
 */
export async function parseOpenAPIFile(
  filePath: string,
): Promise<OpenAPIDocument> {
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
    throw new Error(
      'Invalid OpenAPI document: missing openapi or swagger version field',
    )
  }

  if (!docObj['paths']) {
    throw new Error('Invalid OpenAPI document: missing paths field')
  }

  // Resolve external $ref references
  const resolvedDoc = await resolveExternalRefs(doc as OpenAPIDocument, path.dirname(absolutePath))

  return resolvedDoc
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
    .map((segment) => {
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
export function getPathMethods(
  pathItem: OpenAPIV3.PathItemObject | OpenAPIV3_1.PathItemObject,
): string[] {
  const httpMethods = [
    'get',
    'post',
    'put',
    'delete',
    'patch',
    'options',
    'head',
    'trace',
  ]
  return httpMethods.filter((method) => method in pathItem)
}

/**
 * Check if an operation supports SSE (Server-Sent Events)
 */
export function isSSEOperation(
  operation: OpenAPIV3.OperationObject | OpenAPIV3_1.OperationObject,
): boolean {
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
export function isReferenceObject(
  obj: unknown,
): obj is OpenAPIV3.ReferenceObject {
  return typeof obj === 'object' && obj !== null && '$ref' in obj
}

/**
 * Decode a JSON Pointer token
 * ~1 becomes /, ~0 becomes ~
 */
function jsonPointerDecode(token: string): string {
  return token.replace(/~1/g, '/').replace(/~0/g, '~')
}

/**
 * Extract type name from a $ref
 * Examples:
 *   #/components/schemas/MessageRequestBody -> MessageRequestBody
 *   ../components/schemas/MessageRequestBody.yaml -> MessageRequestBody
 *   ./components/schemas/ValidationError.yaml#/... -> ValidationError
 */
function extractTypeName(ref: string): string | null {
  // Internal reference: #/components/schemas/TypeName
  if (ref.startsWith('#/components/schemas/')) {
    return ref.replace('#/components/schemas/', '')
  }
  
  // External reference: ../components/schemas/TypeName.yaml or ./components/schemas/TypeName.yaml
  const externalMatch = ref.match(/components\/schemas\/([^\/\.]+)(?:\.yaml)?(?:#.*)?$/)
  if (externalMatch) {
    return externalMatch[1]
  }
  
  return null
}

/**
 * Convert a $ref to a type name reference
 * Returns { "$ref": "TypeName" } if the type exists in mainDoc, null otherwise
 */
function convertToTypeRef(ref: string, mainDoc: OpenAPIDocument): { "$ref": string } | null {
  const typeName = extractTypeName(ref)
  if (!typeName) {
    return null
  }
  
  // Verify the type exists in the main document's components
  if (mainDoc.components?.schemas?.[typeName]) {
    return { "$ref": typeName }
  }
  
  return null
}

/**
 * Resolve internal $ref references (e.g., #/components/schemas/...) in an object
 * These references point to the main document's components
 */
async function resolveInternalRefs(
  obj: any,
  mainDoc: OpenAPIDocument,
  baseDir?: string,
): Promise<any> {
  if (obj === null || obj === undefined) {
    return obj
  }

  if (Array.isArray(obj)) {
    return Promise.all(obj.map(item => resolveInternalRefs(item, mainDoc, baseDir)))
  }

  if (typeof obj === 'object' && '$ref' in obj) {
    const ref = (obj as any).$ref
    
    // Try to convert to type name reference first
    const typeRef = convertToTypeRef(ref, mainDoc)
    if (typeRef) {
      return typeRef
    }
    
    // For internal references (starting with #), try to convert to type name
    if (ref.startsWith('#')) {
      // If it's a components/schemas reference, convert to type name
      if (ref.startsWith('#/components/schemas/')) {
        const typeName = extractTypeName(ref)
        // Check if type exists in original doc or resolved doc
        if (typeName) {
          // Try resolved doc first (components may have been resolved)
          if (mainDoc.components?.schemas?.[typeName]) {
            return { "$ref": typeName }
          }
          // If not found, the type might not exist or components not resolved yet
          // In this case, we still convert to type name for consistency
          // The type should exist if the reference is valid
          return { "$ref": typeName }
        }
      }
      // For other internal references, verify they exist but keep as-is if not a schema ref
      const pathParts = ref.substring(1).split('/').filter(Boolean)
      let current: any = mainDoc

      for (const part of pathParts) {
        if (current && typeof current === 'object') {
          current = current[part]
        } else {
          // Reference doesn't exist, return as-is (might be invalid)
          return obj
        }
      }

      // Reference exists, but not a schema reference, return as-is
      return obj
    }
    
    // Resolve external references if baseDir is provided
    if (baseDir && (ref.startsWith('./') || ref.startsWith('../'))) {
      const resolvedValue = await resolveExternalRef(ref, baseDir, mainDoc)
      if (resolvedValue !== undefined) {
        // Recursively resolve any references in the resolved value
        // This will convert schema references to type names
        return resolveInternalRefs(resolvedValue, mainDoc, baseDir)
      }
    }
    
    // External references without baseDir are returned as-is
    return obj
  }

  // Recursively process object properties
  if (typeof obj === 'object') {
    const result: any = {}
    for (const [key, value] of Object.entries(obj)) {
      result[key] = await resolveInternalRefs(value, mainDoc, baseDir)
    }
    return result
  }

  return obj
}

/**
 * Resolve external $ref references in a components object
 */
async function resolveComponentsRefs(
  components: any,
  baseDir: string,
  mainDoc: OpenAPIDocument,
): Promise<any> {
  if (!components || typeof components !== 'object' || Array.isArray(components)) {
    return components
  }

  const resolved: any = {}

  for (const [sectionKey, section] of Object.entries(components)) {
    if (section && typeof section === 'object' && !Array.isArray(section)) {
      resolved[sectionKey] = {}
      for (const [name, value] of Object.entries(section as any)) {
        if (value && typeof value === 'object' && !Array.isArray(value) && '$ref' in value) {
          // Resolve external reference
          const ref = (value as any).$ref
          
          // Try to convert to type name reference first
          const typeRef = convertToTypeRef(ref, mainDoc)
          if (typeRef) {
            resolved[sectionKey][name] = typeRef
          } else if (ref.startsWith('./') || ref.startsWith('../')) {
            // External reference: resolve and then convert
            const resolvedValue = await resolveExternalRef(ref, baseDir, mainDoc)
            if (resolvedValue !== undefined) {
              // Recursively resolve, which will convert schema references to type names
              resolved[sectionKey][name] = await resolveInternalRefs(resolvedValue, mainDoc, baseDir)
            } else {
              resolved[sectionKey][name] = value
            }
          } else if (ref.startsWith('#')) {
            // Internal reference: try to convert to type name
            if (ref.startsWith('#/components/schemas/')) {
              const typeName = extractTypeName(ref)
              if (typeName && mainDoc.components?.schemas?.[typeName]) {
                resolved[sectionKey][name] = { "$ref": typeName }
              } else {
                resolved[sectionKey][name] = value
              }
            } else {
              // Not a schema reference, keep as-is
              resolved[sectionKey][name] = value
            }
          } else {
            resolved[sectionKey][name] = value
          }
        } else if (value && typeof value === 'object' && !Array.isArray(value)) {
          // Recursively process nested objects
          resolved[sectionKey][name] = await resolveComponentsRefs(value, baseDir, mainDoc)
        } else {
          // Primitive values or arrays - just copy
          resolved[sectionKey][name] = value
        }
      }
    } else {
      resolved[sectionKey] = section
    }
  }

  return resolved
}

/**
 * Resolve external $ref references in OpenAPI document
 */
async function resolveExternalRefs(
  doc: OpenAPIDocument,
  baseDir: string,
): Promise<OpenAPIDocument> {
  const resolvedDoc = JSON.parse(JSON.stringify(doc)) // Deep clone

  // First, resolve components references (including external file references)
  if (resolvedDoc.components) {
    resolvedDoc.components = await resolveComponentsRefs(resolvedDoc.components, baseDir, resolvedDoc)
  }

  // Then resolve paths references
  if (resolvedDoc.paths) {
    for (const [pathKey, pathItem] of Object.entries(resolvedDoc.paths)) {
      if (pathItem && typeof pathItem === 'object' && '$ref' in pathItem) {
        // Resolve external path reference
        const resolvedPath = await resolveExternalRef((pathItem as any).$ref, baseDir, resolvedDoc)
        if (resolvedPath !== undefined) {
          // Resolve internal and external references in the resolved path
          // Pass baseDir so external refs in path fragments can be resolved
          const fullyResolvedPath = await resolveInternalRefs(resolvedPath, resolvedDoc, baseDir)
          resolvedDoc.paths[pathKey] = fullyResolvedPath
        }
        // If resolution failed, keep the original $ref
      } else if (pathItem) {
        // Resolve internal and external references in path items that are not external refs
        resolvedDoc.paths[pathKey] = await resolveInternalRefs(pathItem, resolvedDoc, baseDir)
      }
    }
  }

  return resolvedDoc
}

/**
 * Parse a YAML/JSON file without OpenAPI validation
 * Used for parsing fragment files that are not complete OpenAPI documents
 */
function parseFileFragment(filePath: string): any {
  const absolutePath = path.resolve(filePath)
  const content = fs.readFileSync(absolutePath, 'utf-8')
  const ext = path.extname(filePath).toLowerCase()

  if (ext === '.yaml' || ext === '.yml') {
    return yaml.load(content)
  } else if (ext === '.json') {
    return JSON.parse(content)
  } else {
    // Try to parse as YAML first (it's a superset of JSON)
    try {
      return yaml.load(content)
    } catch {
      return JSON.parse(content)
    }
  }
}

/**
 * Resolve a single external $ref
 */
async function resolveExternalRef(
  ref: string,
  baseDir: string,
  mainDoc?: OpenAPIDocument,
): Promise<any> {
  try {
    // Parse ref like "./agent-runs/stop.yaml#/paths/~1agent-run~1{agentRunId}~1stop"
    const [filePath, jsonPath] = ref.split('#')
    const fullPath = path.resolve(baseDir, filePath)

    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      console.warn(`Warning: Referenced file not found: ${fullPath}`)
      return undefined
    }

    // Try to parse as OpenAPI document first, fallback to fragment if it fails
    let refDoc: any
    try {
      refDoc = await parseOpenAPIFile(fullPath)
    } catch {
      // If parsing as OpenAPI fails, try parsing as a fragment (e.g., path fragments)
      refDoc = parseFileFragment(fullPath)
    }

    if (!jsonPath) {
      return refDoc
    }

    // Navigate to the specific path in the document (JSON Pointer syntax)
    const pathParts = jsonPath.split('/').filter(Boolean).map(jsonPointerDecode)
    let current: any = refDoc

    for (const part of pathParts) {
      if (current && typeof current === 'object') {
        current = current[part]
      } else {
        console.warn(`Warning: Cannot resolve path ${jsonPath} in ${filePath}`)
        return undefined
      }
    }

    // If we resolved a path fragment, resolve external refs in it using the fragment file's directory
    // This is important because path fragments may contain external refs relative to the fragment file
    if (current && typeof current === 'object') {
      const fragmentDir = path.dirname(fullPath)
      // Resolve internal and external references in the resolved path fragment
      if (mainDoc) {
        current = await resolveInternalRefs(current, mainDoc, fragmentDir)
      }
    }

    return current
  } catch (error) {
    console.warn(`Warning: Failed to resolve external ref ${ref}: ${error instanceof Error ? error.message : String(error)}`)
    return undefined
  }
}
