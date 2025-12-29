import { isReferenceObject, getRefName } from '../openapi-parser'
import type { SchemaObject, ReferenceObject } from '../shared/openapi-types'
import { formatPropertyName } from '../shared/codegen-utils'

/**
 * Generate Zod schema code from OpenAPI schema
 */
export function schemaToZod(
  schema: SchemaObject | ReferenceObject | undefined,
  indent: string = '',
): string {
  if (!schema) return 'z.unknown()'
  if (isReferenceObject(schema)) {
    const refName = getRefName(schema.$ref)
    return `${refName}Schema`
  }

  const schemaObj = schema as SchemaObject
  const { nullable, primaryType } = parseNullableType(schemaObj)
  const zodCode = convertToZod(schemaObj, primaryType, indent)

  return nullable ? `${zodCode}.nullable()` : zodCode
}

/**
 * Parse nullable info from schema (supports both 3.0 and 3.1)
 */
function parseNullableType(schema: SchemaObject): {
  nullable: boolean
  primaryType: string | undefined
} {
  const nullable30 = 'nullable' in schema && schema.nullable
  const typeValue = schema.type
  let nullable31 = false
  let primaryType: string | undefined

  if (Array.isArray(typeValue)) {
    const types = (typeValue as string[]).filter((t) => t !== 'null')
    nullable31 = (typeValue as string[]).includes('null')
    primaryType = types[0]
  } else {
    primaryType = typeValue as string | undefined
  }

  return { nullable: nullable30 || nullable31, primaryType }
}

/**
 * Convert schema to Zod code
 */
function convertToZod(
  schema: SchemaObject,
  primaryType: string | undefined,
  indent: string,
): string {
  switch (primaryType) {
    case 'string':
      return convertStringZod(schema)
    case 'integer':
    case 'number':
      return convertNumberZod(schema)
    case 'boolean':
      return 'z.boolean()'
    case 'array':
      return convertArrayZod(schema, indent)
    case 'object':
      return convertObjectZod(schema, indent)
    default:
      return convertComplexZod(schema, indent)
  }
}

function convertStringZod(schema: SchemaObject): string {
  let zod = 'z.string()'
  
  if (schema.enum) {
    const enumValues = schema.enum.filter((v: unknown) => v !== null)
    const enumStrings = enumValues.map((v: unknown) => `'${v}'`).join(', ')
    zod = `z.enum([${enumStrings}])`
  } else {
    if (schema.minLength !== undefined) {
      zod += `.min(${schema.minLength})`
    }
    if (schema.maxLength !== undefined) {
      zod += `.max(${schema.maxLength})`
    }
    if (schema.pattern) {
      zod += `.regex(/${schema.pattern}/)`
    }
  }
  
  return zod
}

function convertNumberZod(schema: SchemaObject): string {
  const isInt = schema.type === 'integer'
  let zod = isInt ? 'z.number().int()' : 'z.number()'
  
  if (schema.minimum !== undefined) {
    zod += `.min(${schema.minimum})`
  }
  if (schema.maximum !== undefined) {
    zod += `.max(${schema.maximum})`
  }
  
  return zod
}

function convertArrayZod(schema: SchemaObject, indent: string): string {
  const itemsType =
    'items' in schema
      ? schemaToZod(
          schema.items as SchemaObject | ReferenceObject,
          indent + '  ',
        )
      : 'z.unknown()'
  
  let zod = `z.array(${itemsType})`
  
  if (schema.minItems !== undefined) {
    zod += `.min(${schema.minItems})`
  }
  if (schema.maxItems !== undefined) {
    zod += `.max(${schema.maxItems})`
  }
  
  return zod
}

function convertObjectZod(schema: SchemaObject, indent: string): string {
  if (!schema.properties) {
    return convertAdditionalPropertiesZod(schema)
  }

  const required = new Set(schema.required || [])
  const props = Object.entries(schema.properties)
    .map(([key, propSchema]) => {
      const optional = required.has(key) ? '' : '.optional()'
      const zodSchema = schemaToZod(propSchema, indent + '  ')
      const propName = formatPropertyName(key)
      return `${indent}  ${propName}: ${zodSchema}${optional}`
    })
    .join(',\n')

  return `z.object({\n${props}\n${indent}})`
}

function convertAdditionalPropertiesZod(schema: SchemaObject): string {
  if (schema.additionalProperties) {
    if (typeof schema.additionalProperties === 'boolean') {
      return schema.additionalProperties ? 'z.record(z.unknown())' : 'z.object({})'
    }
    const valueType = schemaToZod(schema.additionalProperties, '')
    return `z.record(${valueType})`
  }
  return 'z.object({})'
}

function convertComplexZod(schema: SchemaObject, indent: string): string {
  if ('anyOf' in schema && schema.anyOf) {
    const schemas = schema.anyOf
      .map((s: SchemaObject | ReferenceObject) => schemaToZod(s, indent))
      .join(', ')
    return `z.union([${schemas}])`
  }
  if ('oneOf' in schema && schema.oneOf) {
    const schemas = schema.oneOf
      .map((s: SchemaObject | ReferenceObject) => schemaToZod(s, indent))
      .join(', ')
    return `z.union([${schemas}])`
  }
  if ('allOf' in schema && schema.allOf) {
    const schemas = schema.allOf
      .map((s: SchemaObject | ReferenceObject) => schemaToZod(s, indent))
      .join(', ')
    return `z.intersection(${schemas.split(', ').join(', ')})`
  }
  if (schema.properties) {
    return convertObjectZod(schema, indent)
  }
  return 'z.unknown()'
}

