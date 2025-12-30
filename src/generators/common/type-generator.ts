/**
 * schemaToTypeScript(schema: JSONSchema | Ref, typeName?: string): string
 * - schema: JSONSchema 或 Ref
 * - typeName: 可选的类型名称
 * - 返回: TypeScript 类型字符串
 */

import type { JSONSchema, Ref } from '../../types';

export function schemaToTypeScript(schema: JSONSchema | Ref, typeName?: string): string {
  if ('$ref' in schema) {
    return schema.$ref;
  }

  if (schema.type === 'string') return 'string';
  if (schema.type === 'number' || schema.type === 'integer') return 'number';
  if (schema.type === 'boolean') return 'boolean';
  if (schema.type === 'null') return 'null';

  if (schema.type === 'array') {
    const items = schema.items;
    if (!items) return 'unknown[]';
    if ('$ref' in items) return `${items.$ref}[]`;
    return `${schemaToTypeScript(items)}[]`;
  }

  if (schema.type === 'object' || !schema.type) {
    if (Object.keys(schema.properties).length === 0) {
      return 'Record<string, unknown>';
    }

    const props = Object.entries(schema.properties).map(([key, value]) => {
      const optional = schema.required?.includes(key) ? '' : '?';
      const valueType = '$ref' in value ? value.$ref : schemaToTypeScript(value);
      return `  ${key}${optional}: ${valueType};`;
    });

    return `{\n${props.join('\n')}\n}`;
  }

  if (Array.isArray(schema.type)) {
    return schema.type.join(' | ');
  }

  return 'unknown';
}

