/**
 * toJSONSchema(raw: unknown): JSONSchema
 * - raw: 原始的 OpenAPI schema 对象
 * - 返回: 规范化的 JSONSchema
 */

import type { JSONSchema, Ref } from '../../types';

export function toJSONSchema(raw: unknown): JSONSchema {
  if (!raw || typeof raw !== 'object') {
    return createEmptySchema();
  }

  const schema = raw as Record<string, unknown>;

  return {
    type: normalizeType(schema['type']),
    format: normalizeString(schema['format']),
    enum: normalizeArray(schema['enum']),
    const: schema['const'] ?? null,

    minLength: normalizeNumber(schema['minLength']),
    maxLength: normalizeNumber(schema['maxLength']),
    pattern: normalizeString(schema['pattern']),

    minimum: normalizeNumber(schema['minimum']),
    maximum: normalizeNumber(schema['maximum']),
    exclusiveMinimum: normalizeNumber(schema['exclusiveMinimum']),
    exclusiveMaximum: normalizeNumber(schema['exclusiveMaximum']),
    multipleOf: normalizeNumber(schema['multipleOf']),

    items: normalizeSchemaOrRef(schema['items']),
    minItems: normalizeNumber(schema['minItems']),
    maxItems: normalizeNumber(schema['maxItems']),
    uniqueItems: normalizeBoolean(schema['uniqueItems']),

    properties: normalizeProperties(schema['properties']),
    required: normalizeStringArray(schema['required']),
    additionalProperties: normalizeAdditionalProperties(schema['additionalProperties']),

    allOf: normalizeSchemaOrRefArray(schema['allOf']),
    anyOf: normalizeSchemaOrRefArray(schema['anyOf']),
    oneOf: normalizeSchemaOrRefArray(schema['oneOf']),
    not: normalizeSchemaOrRef(schema['not']),

    title: normalizeString(schema['title']),
    description: normalizeString(schema['description']),
    default: schema['default'] ?? null,
    examples: normalizeArray(schema['examples']),
    deprecated: schema['deprecated'] === true,
    nullable: schema['nullable'] === true,
  };
}

export function toRef(raw: unknown): Ref | null {
  if (!raw || typeof raw !== 'object') return null;
  const obj = raw as Record<string, unknown>;
  if (typeof obj['$ref'] !== 'string') return null;
  return { $ref: extractTypeName(obj['$ref']) };
}

export function isRef(raw: unknown): boolean {
  return raw !== null && typeof raw === 'object' && '$ref' in (raw as object);
}

function extractTypeName(ref: string): string {
  // #/components/schemas/TypeName -> TypeName
  const prefix = '#/components/schemas/';
  if (ref.startsWith(prefix)) {
    return ref.slice(prefix.length);
  }
  return ref;
}

function createEmptySchema(): JSONSchema {
  return {
    type: null, format: null, enum: null, const: null,
    minLength: null, maxLength: null, pattern: null,
    minimum: null, maximum: null, exclusiveMinimum: null, exclusiveMaximum: null, multipleOf: null,
    items: null, minItems: null, maxItems: null, uniqueItems: null,
    properties: {}, required: [], additionalProperties: null,
    allOf: null, anyOf: null, oneOf: null, not: null,
    title: null, description: null, default: null, examples: null,
    deprecated: false, nullable: false,
  };
}

function normalizeType(value: unknown): JSONSchema['type'] {
  if (typeof value === 'string') return value as JSONSchema['type'];
  if (Array.isArray(value)) return value as JSONSchema['type'];
  return null;
}

function normalizeString(value: unknown): string | null {
  return typeof value === 'string' ? value : null;
}

function normalizeNumber(value: unknown): number | null {
  return typeof value === 'number' ? value : null;
}

function normalizeBoolean(value: unknown): boolean | null {
  return typeof value === 'boolean' ? value : null;
}

function normalizeArray(value: unknown): unknown[] | null {
  return Array.isArray(value) ? value : null;
}

function normalizeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((v): v is string => typeof v === 'string');
}

function normalizeSchemaOrRef(value: unknown): JSONSchema | Ref | null {
  if (!value) return null;
  if (isRef(value)) return toRef(value);
  return toJSONSchema(value);
}

function normalizeSchemaOrRefArray(value: unknown): (JSONSchema | Ref)[] | null {
  if (!Array.isArray(value)) return null;
  return value.map(v => isRef(v) ? toRef(v)! : toJSONSchema(v));
}

function normalizeProperties(value: unknown): Record<string, JSONSchema | Ref> {
  if (!value || typeof value !== 'object') return {};
  const result: Record<string, JSONSchema | Ref> = {};
  for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
    result[key] = isRef(val) ? toRef(val)! : toJSONSchema(val);
  }
  return result;
}

function normalizeAdditionalProperties(value: unknown): boolean | JSONSchema | Ref | null {
  if (value === undefined) return null;
  if (typeof value === 'boolean') return value;
  if (isRef(value)) return toRef(value);
  return toJSONSchema(value);
}

