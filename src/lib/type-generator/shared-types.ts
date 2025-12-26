import { isReferenceObject, getRefName } from '../openapi-parser.js'
import { buildFileHeader } from '../shared/codegen-utils.js'
import type { SchemaObject, ReferenceObject } from '../shared/openapi-types.js'
import { schemaToTypeScript } from './schema-converter.js'

/**
 * Generate shared types file content from OpenAPI components/schemas
 */
export function generateSharedTypes(
  schemas: Record<string, SchemaObject | ReferenceObject> | undefined,
): string {
  if (!schemas) {
    return '// No shared schemas defined in OpenAPI spec\n'
  }

  const lines = buildFileHeader('shared types from OpenAPI specification')

  for (const [name, schema] of Object.entries(schemas)) {
    lines.push(generateSchemaType(name, schema))
    lines.push('')
  }

  return lines.join('\n')
}

function generateSchemaType(
  name: string,
  schema: SchemaObject | ReferenceObject,
): string {
  if (isReferenceObject(schema)) {
    return `export type ${name} = ${getRefName(schema.$ref)}`
  }

  const typeStr = schemaToTypeScript(schema, '')
  if (typeStr.startsWith('{')) {
    return `export interface ${name} ${typeStr}`
  }
  return `export type ${name} = ${typeStr}`
}
