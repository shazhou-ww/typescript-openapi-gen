import { isReferenceObject, getRefName } from '../openapi-parser'
import type { SchemaObject, ReferenceObject } from '../shared/openapi-types'
import { formatPropertyName } from '../shared/codegen-utils'

/**
 * Generate TypeScript type from OpenAPI schema
 */
export function schemaToTypeScript(
  schema: SchemaObject | ReferenceObject | undefined,
  indent: string = '',
): string {
  if (!schema) return 'unknown'
  if (isReferenceObject(schema)) return getRefName(schema.$ref)

  const schemaObj = schema as SchemaObject
  const { nullable, primaryType } = parseNullableType(schemaObj)
  const typeStr = convertType(schemaObj, primaryType, indent)

  return nullable ? `(${typeStr}) | null` : typeStr
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
 * Convert schema type to TypeScript type string
 */
function convertType(
  schema: SchemaObject,
  primaryType: string | undefined,
  indent: string,
): string {
  switch (primaryType) {
    case 'string':
      return convertStringType(schema)
    case 'integer':
    case 'number':
      return 'number'
    case 'boolean':
      return 'boolean'
    case 'array':
      return convertArrayType(schema, indent)
    case 'object':
      return objectSchemaToTypeScript(schema, indent)
    default:
      return convertComplexType(schema, indent)
  }
}

function convertStringType(schema: SchemaObject): string {
  if (schema.enum) {
    const enumValues = schema.enum.filter((v: unknown) => v !== null)
    return enumValues.map((v: unknown) => `'${v}'`).join(' | ')
  }
  return 'string'
}

function convertArrayType(schema: SchemaObject, indent: string): string {
  const itemsType =
    'items' in schema
      ? schemaToTypeScript(
          schema.items as SchemaObject | ReferenceObject,
          indent,
        )
      : 'unknown'
  return `Array<${itemsType}>`
}

function convertComplexType(schema: SchemaObject, indent: string): string {
  if ('anyOf' in schema && schema.anyOf) {
    return schema.anyOf
      .map((s: SchemaObject | ReferenceObject) => schemaToTypeScript(s, indent))
      .join(' | ')
  }
  if ('oneOf' in schema && schema.oneOf) {
    return schema.oneOf
      .map((s: SchemaObject | ReferenceObject) => schemaToTypeScript(s, indent))
      .join(' | ')
  }
  if ('allOf' in schema && schema.allOf) {
    return schema.allOf
      .map((s: SchemaObject | ReferenceObject) => schemaToTypeScript(s, indent))
      .join(' & ')
  }
  if (schema.properties) {
    return objectSchemaToTypeScript(schema, indent)
  }
  return 'unknown'
}

/**
 * Generate TypeScript object type from OpenAPI object schema
 */
function objectSchemaToTypeScript(
  schema: SchemaObject,
  indent: string,
): string {
  if (!schema.properties) {
    return convertAdditionalProperties(schema, indent)
  }

  const required = new Set(schema.required || [])
  const props = Object.entries(schema.properties)
    .map(([key, propSchema]) => {
      const optional = required.has(key) ? '' : '?'
      const propType = schemaToTypeScript(propSchema, indent + '  ')
      const propName = formatPropertyName(key)
      return `${indent}  ${propName}${optional}: ${propType}`
    })
    .join('\n')

  return `{\n${props}\n${indent}}`
}

function convertAdditionalProperties(
  schema: SchemaObject,
  indent: string,
): string {
  if (schema.additionalProperties) {
    if (typeof schema.additionalProperties === 'boolean') {
      return 'Record<string, unknown>'
    }
    const valueType = schemaToTypeScript(schema.additionalProperties, indent)
    return `Record<string, ${valueType}>`
  }
  return 'Record<string, unknown>'
}
