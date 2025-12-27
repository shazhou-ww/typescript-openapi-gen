import * as fs from 'node:fs'
import * as path from 'node:path'
import * as yaml from 'js-yaml'
import type { OpenAPIDocument } from './types'
import { resolveExternalRefs } from './ref-resolver'

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

