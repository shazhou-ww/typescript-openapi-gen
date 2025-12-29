/**
 * 简化版 JSONSchema 类型定义
 * 
 * 导出: JSONSchema, JSONSchemaType, Ref
 * 
 * JSONSchema: 用于描述数据结构的 schema
 * Ref: 指向 types 中定义的类型名
 */

export type JSONSchemaType = 'string' | 'number' | 'integer' | 'boolean' | 'array' | 'object' | 'null';

/** Ref 指向 OpenApiDocument.types 中定义的类型名 */
export type Ref = { $ref: string };

export type JSONSchema = {
  type: JSONSchemaType | JSONSchemaType[] | null;
  format: string | null;
  enum: unknown[] | null;
  const: unknown | null;

  // string
  minLength: number | null;
  maxLength: number | null;
  pattern: string | null;

  // number
  minimum: number | null;
  maximum: number | null;
  exclusiveMinimum: number | null;
  exclusiveMaximum: number | null;
  multipleOf: number | null;

  // array
  items: JSONSchema | Ref | null;
  minItems: number | null;
  maxItems: number | null;
  uniqueItems: boolean | null;

  // object
  properties: Record<string, JSONSchema | Ref>;
  required: string[];
  additionalProperties: boolean | JSONSchema | Ref | null;

  // composition
  allOf: (JSONSchema | Ref)[] | null;
  anyOf: (JSONSchema | Ref)[] | null;
  oneOf: (JSONSchema | Ref)[] | null;
  not: JSONSchema | Ref | null;

  // metadata
  title: string | null;
  description: string | null;
  default: unknown | null;
  examples: unknown[] | null;
  deprecated: boolean;
  nullable: boolean;
};

