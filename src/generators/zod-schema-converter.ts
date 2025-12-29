/**
 * schemaToZod(schema: JSONSchema | Ref, sharedTypesDir: string): string
 * - schema: JSONSchema 或 Ref
 * - sharedTypesDir: 共享类型目录路径（用于引用类型）
 * - 返回: Zod schema 代码字符串
 */

import type { JSONSchema, Ref } from '../types';

export function schemaToZod(schema: JSONSchema | Ref | null, sharedTypesDir: string): string {
  if (!schema) return 'z.unknown()';
  if ('$ref' in schema) {
    return `${schema.$ref}Schema`;
  }

  const { nullable, primaryType } = parseNullableType(schema);
  const zodCode = convertToZod(schema, primaryType, sharedTypesDir);

  return nullable ? `${zodCode}.nullable()` : zodCode;
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

function convertToZod(schema: JSONSchema, primaryType: string | null, sharedTypesDir: string): string {
  if (!primaryType) {
    if (schema.enum) return convertEnumZod(schema);
    if (schema.anyOf) return convertAnyOfZod(schema, sharedTypesDir);
    if (schema.oneOf) return convertOneOfZod(schema, sharedTypesDir);
    if (schema.allOf) return convertAllOfZod(schema, sharedTypesDir);
    return 'z.unknown()';
  }

  switch (primaryType) {
    case 'string':
      return convertStringZod(schema);
    case 'integer':
    case 'number':
      return convertNumberZod(schema);
    case 'boolean':
      return 'z.boolean()';
    case 'array':
      return convertArrayZod(schema, sharedTypesDir);
    case 'object':
      return convertObjectZod(schema, sharedTypesDir);
    case 'null':
      return 'z.null()';
    default:
      return 'z.unknown()';
  }
}

function convertStringZod(schema: JSONSchema): string {
  let zod = 'z.string()';

  if (schema.enum) {
    const enumValues = schema.enum.filter(v => v !== null);
    const enumStrings = enumValues.map(v => `'${String(v).replace(/'/g, "\\'")}'`).join(', ');
    return `z.enum([${enumStrings}])`;
  }

  if (schema.minLength !== null) zod += `.min(${schema.minLength})`;
  if (schema.maxLength !== null) zod += `.max(${schema.maxLength})`;
  if (schema.pattern) zod += `.regex(/${schema.pattern}/)`;

  return zod;
}

function convertNumberZod(schema: JSONSchema): string {
  const isInt = schema.type === 'integer' || (Array.isArray(schema.type) && schema.type.includes('integer'));
  let zod = isInt ? 'z.number().int()' : 'z.number()';

  if (schema.minimum !== null) zod += `.min(${schema.minimum})`;
  if (schema.maximum !== null) zod += `.max(${schema.maximum})`;
  if (schema.exclusiveMinimum !== null) zod += `.gt(${schema.exclusiveMinimum})`;
  if (schema.exclusiveMaximum !== null) zod += `.lt(${schema.exclusiveMaximum})`;
  if (schema.multipleOf !== null) zod += `.multipleOf(${schema.multipleOf})`;

  return zod;
}

function convertArrayZod(schema: JSONSchema, sharedTypesDir: string): string {
  if (!schema.items) return 'z.array(z.unknown())';

  const itemsZod = schemaToZod(schema.items, sharedTypesDir);
  let zod = `z.array(${itemsZod})`;

  if (schema.minItems !== null) zod += `.min(${schema.minItems})`;
  if (schema.maxItems !== null) zod += `.max(${schema.maxItems})`;
  if (schema.uniqueItems) zod += '.unique()';

  return zod;
}

function convertObjectZod(schema: JSONSchema, sharedTypesDir: string): string {
  const props: string[] = [];

  for (const [key, value] of Object.entries(schema.properties)) {
    const valueZod = schemaToZod(value, sharedTypesDir);
    const required = schema.required?.includes(key);
    const propZod = required ? valueZod : `${valueZod}.optional()`;
    props.push(`  ${key}: ${propZod}`);
  }

  if (props.length === 0) {
    if (schema.additionalProperties === false) return 'z.object({}).strict()';
    if (schema.additionalProperties === true) return 'z.record(z.unknown())';
    return 'z.object({})';
  }

  const propsStr = props.join(',\n');
  let zod = `z.object({\n${propsStr}\n})`;

  if (schema.additionalProperties === false) zod += '.strict()';
  if (schema.additionalProperties === true) zod += '.passthrough()';
  if (schema.additionalProperties && typeof schema.additionalProperties === 'object') {
    const additionalZod = schemaToZod(schema.additionalProperties, sharedTypesDir);
    zod += `.catchall(${additionalZod})`;
  }

  return zod;
}

function convertEnumZod(schema: JSONSchema): string {
  if (!schema.enum || schema.enum.length === 0) return 'z.unknown()';
  const enumValues = schema.enum.filter(v => v !== null);
  const enumStrings = enumValues.map(v => {
    if (typeof v === 'string') return `'${v.replace(/'/g, "\\'")}'`;
    return String(v);
  }).join(', ');
  return `z.enum([${enumStrings}])`;
}

function convertAnyOfZod(schema: JSONSchema, sharedTypesDir: string): string {
  if (!schema.anyOf || schema.anyOf.length === 0) return 'z.unknown()';
  const zodSchemas = schema.anyOf.map(s => {
    const zod = schemaToZod(s, sharedTypesDir);
    // 如果包含换行符，需要正确缩进
    if (zod.includes('\n')) {
      return zod.split('\n').map((line, i) => i === 0 ? line : '  ' + line).join('\n');
    }
    return zod;
  });
  return `z.union([${zodSchemas.join(', ')}])`;
}

function convertOneOfZod(schema: JSONSchema, sharedTypesDir: string): string {
  if (!schema.oneOf || schema.oneOf.length === 0) return 'z.unknown()';
  const zodSchemas = schema.oneOf.map(s => {
    const zod = schemaToZod(s, sharedTypesDir);
    // 如果包含换行符，需要正确缩进
    if (zod.includes('\n')) {
      return zod.split('\n').map((line, i) => i === 0 ? line : '  ' + line).join('\n');
    }
    return zod;
  });
  return `z.union([${zodSchemas.join(', ')}])`;
}

function convertAllOfZod(schema: JSONSchema, sharedTypesDir: string): string {
  if (!schema.allOf || schema.allOf.length === 0) return 'z.unknown()';
  const zodSchemas = schema.allOf.map(s => schemaToZod(s, sharedTypesDir));
  if (zodSchemas.length === 1) return zodSchemas[0];
  return `z.intersection(${zodSchemas.join(', ')})`;
}

