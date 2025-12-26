import { isReferenceObject, getRefName } from '../openapi-parser.js'
import { buildFileHeader } from '../shared/codegen-utils.js'
import type { SchemaObject, ReferenceObject } from '../shared/openapi-types.js'
import { schemaToZod } from './zod-schema-converter.js'

export interface SharedTypeFile {
  name: string
  content: string
}

export interface SharedTypesResult {
  files: SharedTypeFile[]
  indexContent: string
}

/**
 * Generate shared types as separate files from OpenAPI components/schemas
 */
export function generateSharedTypes(
  schemas: Record<string, SchemaObject | ReferenceObject> | undefined,
): SharedTypesResult {
  if (!schemas) {
    return {
      files: [],
      indexContent: '// No shared schemas defined in OpenAPI spec\n',
    }
  }

  const files: SharedTypeFile[] = []
  const exportLines: string[] = []

  // Sort schema names for consistent output
  const schemaNames = Object.keys(schemas).sort()

  for (const name of schemaNames) {
    const schema = schemas[name]
    const fileContent = generateSchemaFile(name, schema, schemas)
    files.push({ name, content: fileContent })
    exportLines.push(`export { ${name}Schema, ${name} } from './${name}.gen'`)
  }

  const indexLines = buildFileHeader('shared types index')
  indexLines.push(...exportLines)
  indexLines.push('')

  return {
    files,
    indexContent: indexLines.join('\n'),
  }
}

function generateSchemaFile(
  name: string,
  schema: SchemaObject | ReferenceObject,
  allSchemas: Record<string, SchemaObject | ReferenceObject>,
): string {
  const lines = buildFileHeader(`${name} type from OpenAPI specification`)

  // Collect referenced types for imports
  const referencedTypes = collectSchemaRefs(schema, allSchemas, new Set([name]))

  // Import zod
  lines.push("import { z } from 'zod'")
  lines.push('')

  if (referencedTypes.size > 0) {
    const imports = Array.from(referencedTypes).sort()
    for (const refType of imports) {
      lines.push(`import { ${refType}Schema } from './${refType}.gen'`)
    }
    lines.push('')
  }

  lines.push(generateZodSchema(name, schema))
  lines.push('')

  return lines.join('\n')
}

function collectSchemaRefs(
  schema: SchemaObject | ReferenceObject,
  allSchemas: Record<string, SchemaObject | ReferenceObject>,
  visited: Set<string> = new Set(),
): Set<string> {
  const refs = new Set<string>()

  if (isReferenceObject(schema)) {
    const refName = getRefName(schema.$ref)
    if (!visited.has(refName) && allSchemas[refName]) {
      visited.add(refName)
      refs.add(refName)
      // Also collect nested refs
      const nestedRefs = collectSchemaRefs(
        allSchemas[refName],
        allSchemas,
        visited,
      )
      nestedRefs.forEach((r) => refs.add(r))
    }
    return refs
  }

  // Check properties
  if (schema.properties) {
    for (const prop of Object.values(schema.properties)) {
      const propRefs = collectSchemaRefs(
        prop as SchemaObject | ReferenceObject,
        allSchemas,
        visited,
      )
      propRefs.forEach((r) => refs.add(r))
    }
  }

  // Check items (for arrays)
  if ('items' in schema && schema.items) {
    const itemRefs = collectSchemaRefs(
      schema.items as SchemaObject | ReferenceObject,
      allSchemas,
      visited,
    )
    itemRefs.forEach((r) => refs.add(r))
  }

  // Check allOf, oneOf, anyOf
  for (const key of ['allOf', 'oneOf', 'anyOf'] as const) {
    const subSchemas = schema[key]
    if (subSchemas) {
      for (const sub of subSchemas) {
        const subRefs = collectSchemaRefs(
          sub as SchemaObject | ReferenceObject,
          allSchemas,
          visited,
        )
        subRefs.forEach((r) => refs.add(r))
      }
    }
  }

  // Check additionalProperties
  if (
    schema.additionalProperties &&
    typeof schema.additionalProperties === 'object'
  ) {
    const addRefs = collectSchemaRefs(
      schema.additionalProperties as SchemaObject | ReferenceObject,
      allSchemas,
      visited,
    )
    addRefs.forEach((r) => refs.add(r))
  }

  return refs
}

function generateZodSchema(
  name: string,
  schema: SchemaObject | ReferenceObject,
): string {
  const zodSchema = schemaToZod(schema, '')
  return `export const ${name}Schema = ${zodSchema}\n\nexport type ${name} = z.infer<typeof ${name}Schema>`
}
