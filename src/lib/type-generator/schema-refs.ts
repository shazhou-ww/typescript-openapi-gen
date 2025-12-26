import { isReferenceObject, getRefName } from '../openapi-parser.js'
import type { SchemaObject, ReferenceObject } from '../shared/openapi-types.js'

/**
 * Extract all referenced schema names from a schema
 */
export function extractSchemaRefs(
  schema: SchemaObject | ReferenceObject | undefined,
  refs: Set<string> = new Set(),
): Set<string> {
  if (!schema) return refs

  if (isReferenceObject(schema)) {
    refs.add(getRefName(schema.$ref))
    return refs
  }

  const schemaObj = schema as SchemaObject

  extractFromItems(schemaObj, refs)
  extractFromProperties(schemaObj, refs)
  extractFromAdditionalProperties(schemaObj, refs)
  extractFromCompositions(schemaObj, refs)

  return refs
}

function extractFromItems(schema: SchemaObject, refs: Set<string>): void {
  if ('items' in schema && schema.items) {
    extractSchemaRefs(schema.items as SchemaObject | ReferenceObject, refs)
  }
}

function extractFromProperties(schema: SchemaObject, refs: Set<string>): void {
  if (schema.properties) {
    for (const propSchema of Object.values(schema.properties)) {
      extractSchemaRefs(propSchema, refs)
    }
  }
}

function extractFromAdditionalProperties(
  schema: SchemaObject,
  refs: Set<string>,
): void {
  if (
    schema.additionalProperties &&
    typeof schema.additionalProperties !== 'boolean'
  ) {
    extractSchemaRefs(schema.additionalProperties, refs)
  }
}

function extractFromCompositions(
  schema: SchemaObject,
  refs: Set<string>,
): void {
  if ('anyOf' in schema && schema.anyOf) {
    for (const s of schema.anyOf) {
      extractSchemaRefs(s, refs)
    }
  }
  if ('oneOf' in schema && schema.oneOf) {
    for (const s of schema.oneOf) {
      extractSchemaRefs(s, refs)
    }
  }
  if ('allOf' in schema && schema.allOf) {
    for (const s of schema.allOf) {
      extractSchemaRefs(s, refs)
    }
  }
}
