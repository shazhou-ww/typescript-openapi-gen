/**
 * schemaToElysia(schema: JSONSchema | Ref, sharedTypesDir: string): string
 * - schema: JSONSchema 或 Ref
 * - sharedTypesDir: 共享类型目录路径（用于引用类型）
 * - 返回: Elysia TypeBox schema 代码字符串
 */

import type { JSONSchema, Ref } from '../../types';

export function schemaToElysia(schema: JSONSchema | Ref | null, sharedTypesDir: string): string {
  if (!schema) return 't.Any()';
  if ('$ref' in schema) {
    return `${schema.$ref}Schema`;
  }

  const { nullable, primaryType } = parseNullableType(schema);
  const elysiaCode = convertToElysia(schema, primaryType, sharedTypesDir);

  return nullable ? `t.Union([${elysiaCode}, t.Null()])` : elysiaCode;
}

function parseNullableType(schema: JSONSchema): { nullable: boolean; primaryType: string | null } {
  if (schema.nullable) return { nullable: true, primaryType: schema.type as string | null };

  if (Array.isArray(schema.type)) {
    const types = schema.type.filter(t => t !== 'null');
    const nullable = schema.type.includes('null');
    return { nullable, primaryType: types[0] || null };
  }

  return { nullable: false, primaryType: schema.type as string | null };
}

function convertToElysia(schema: JSONSchema, primaryType: string | null, sharedTypesDir: string): string {
  if (!primaryType) {
    if (schema.enum) return convertEnumElysia(schema);
    if (schema.anyOf) return convertAnyOfElysia(schema, sharedTypesDir);
    if (schema.oneOf) return convertOneOfElysia(schema, sharedTypesDir);
    if (schema.allOf) return convertAllOfElysia(schema, sharedTypesDir);
    return 't.Any()';
  }

  switch (primaryType) {
    case 'string':
      return convertStringElysia(schema);
    case 'integer':
    case 'number':
      return convertNumberElysia(schema);
    case 'boolean':
      return 't.Boolean()';
    case 'array':
      return convertArrayElysia(schema, sharedTypesDir);
    case 'object':
      return convertObjectElysia(schema, sharedTypesDir);
    case 'null':
      return 't.Null()';
    default:
      return 't.Any()';
  }
}

function convertStringElysia(schema: JSONSchema): string {
  let elysia = 't.String()';

  if (schema.enum) {
    const enumValues = schema.enum.filter(v => v !== null);
    const enumStrings = enumValues.map(v => `'${String(v).replace(/'/g, "\\'")}'`).join(', ');
    return `t.Union([${enumStrings}])`;
  }

  if (schema.minLength !== null) elysia += `.min(${schema.minLength})`;
  if (schema.maxLength !== null) elysia += `.max(${schema.maxLength})`;
  if (schema.pattern) elysia += `.pattern(/${schema.pattern}/)`;

  return elysia;
}

function convertNumberElysia(schema: JSONSchema): string {
  const isInt = schema.type === 'integer' || (Array.isArray(schema.type) && schema.type.includes('integer'));
  let elysia = isInt ? 't.Integer()' : 't.Number()';

  if (schema.minimum !== null) elysia += `.minimum(${schema.minimum})`;
  if (schema.maximum !== null) elysia += `.maximum(${schema.maximum})`;
  if (schema.exclusiveMinimum !== null) elysia += `.exclusiveMinimum(${schema.exclusiveMinimum})`;
  if (schema.exclusiveMaximum !== null) elysia += `.exclusiveMaximum(${schema.exclusiveMaximum})`;
  if (schema.multipleOf !== null) elysia += `.multipleOf(${schema.multipleOf})`;

  return elysia;
}

function convertArrayElysia(schema: JSONSchema, sharedTypesDir: string): string {
  if (!schema.items) return 't.Array(t.Any())';

  const itemsElysia = schemaToElysia(schema.items, sharedTypesDir);
  let elysia = `t.Array(${itemsElysia})`;

  if (schema.minItems !== null) elysia += `.minItems(${schema.minItems})`;
  if (schema.maxItems !== null) elysia += `.maxItems(${schema.maxItems})`;

  return elysia;
}

function convertObjectElysia(schema: JSONSchema, sharedTypesDir: string): string {
  const props: string[] = [];

  for (const [key, value] of Object.entries(schema.properties || {})) {
    const valueElysia = schemaToElysia(value, sharedTypesDir);
    const required = schema.required?.includes(key);
    const propElysia = required ? valueElysia : `t.Optional(${valueElysia})`;
    props.push(`  ${key}: ${propElysia}`);
  }

  if (props.length === 0) {
    if (schema.additionalProperties === false) return 't.Object({})';
    if (schema.additionalProperties === true) return 't.Record(t.String(), t.Any())';
    return 't.Object({})';
  }

  const propsStr = props.join(',\n');
  let elysia = `t.Object({\n${propsStr}\n})`;

  // Note: TypeBox Object is strict by default (no additionalProperties)
  // If additionalProperties is true or an object, we should use Record instead
  // But for now, we'll keep Object for compatibility
  if (schema.additionalProperties === true) {
    // For additionalProperties: true, we might want to use t.Record
    // But this changes the structure, so we'll keep Object for now
  } else if (schema.additionalProperties && typeof schema.additionalProperties === 'object') {
    // For additionalProperties with schema, TypeBox doesn't have direct support
    // We'll keep Object structure
  }

  return elysia;
}

function convertEnumElysia(schema: JSONSchema): string {
  if (!schema.enum || schema.enum.length === 0) return 't.Any()';
  const enumValues = schema.enum.filter(v => v !== null);
  const enumStrings = enumValues.map(v => {
    if (typeof v === 'string') return `'${v.replace(/'/g, "\\'")}'`;
    return String(v);
  }).join(', ');
  return `t.Union([${enumStrings}])`;
}

function convertAnyOfElysia(schema: JSONSchema, sharedTypesDir: string): string {
  if (!schema.anyOf || schema.anyOf.length === 0) return 't.Any()';
  const elysiaSchemas = schema.anyOf.map(s => schemaToElysia(s, sharedTypesDir));
  return `t.Union([${elysiaSchemas.join(', ')}])`;
}

function convertOneOfElysia(schema: JSONSchema, sharedTypesDir: string): string {
  if (!schema.oneOf || schema.oneOf.length === 0) return 't.Any()';
  const elysiaSchemas = schema.oneOf.map(s => schemaToElysia(s, sharedTypesDir));
  return `t.Union([${elysiaSchemas.join(', ')}])`;
}

function convertAllOfElysia(schema: JSONSchema, sharedTypesDir: string): string {
  if (!schema.allOf || schema.allOf.length === 0) return 't.Any()';
  const elysiaSchemas = schema.allOf.map(s => schemaToElysia(s, sharedTypesDir));
  if (elysiaSchemas.length === 1) return elysiaSchemas[0];
  // TypeBox uses Intersect for allOf
  return `t.Intersect([${elysiaSchemas.join(', ')}])`;
}

