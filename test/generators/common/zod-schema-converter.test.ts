/**
 * zod-schema-converter.test.ts
 * 测试 schemaToZod 函数
 */

import { describe, it, expect } from 'vitest';
import { schemaToZod } from '../../../src/generators/common/zod-schema-converter';
import type { JSONSchema, Ref } from '../../../src/types';

describe('schemaToZod', () => {
  const sharedTypesDir = '../../shared-types';

  it('should convert null to z.unknown()', () => {
    const result = schemaToZod(null, sharedTypesDir);

    expect(result).toBe('z.unknown()');
  });

  it('should convert ref to schema reference', () => {
    const ref: Ref = { $ref: 'User' };
    const result = schemaToZod(ref, sharedTypesDir);

    expect(result).toBe('UserSchema');
  });

  it('should convert string type', () => {
    const schema: JSONSchema = {
      type: 'string',
      format: null,
      enum: null,
      const: null,
      minLength: null,
      maxLength: null,
      pattern: null,
      minimum: null,
      maximum: null,
      exclusiveMinimum: null,
      exclusiveMaximum: null,
      multipleOf: null,
      items: null,
      minItems: null,
      maxItems: null,
      uniqueItems: null,
      properties: {},
      required: [],
      additionalProperties: null,
      allOf: null,
      anyOf: null,
      oneOf: null,
      not: null,
      title: null,
      description: null,
      default: null,
      examples: null,
      deprecated: false,
      nullable: false,
    };

    const result = schemaToZod(schema, sharedTypesDir);

    expect(result).toBe('z.string()');
  });

  it('should convert string with constraints', () => {
    const schema: JSONSchema = {
      type: 'string',
      format: null,
      enum: null,
      const: null,
      minLength: 1,
      maxLength: 100,
      pattern: '^[a-z]+$',
      minimum: null,
      maximum: null,
      exclusiveMinimum: null,
      exclusiveMaximum: null,
      multipleOf: null,
      items: null,
      minItems: null,
      maxItems: null,
      uniqueItems: null,
      properties: {},
      required: [],
      additionalProperties: null,
      allOf: null,
      anyOf: null,
      oneOf: null,
      not: null,
      title: null,
      description: null,
      default: null,
      examples: null,
      deprecated: false,
      nullable: false,
    };

    const result = schemaToZod(schema, sharedTypesDir);

    expect(result).toContain('.min(1)');
    expect(result).toContain('.max(100)');
    expect(result).toContain('.regex(/^[a-z]+$/)');
  });

  it('should convert string enum', () => {
    const schema: JSONSchema = {
      type: 'string',
      format: null,
      enum: ['active', 'inactive', 'pending'],
      const: null,
      minLength: null,
      maxLength: null,
      pattern: null,
      minimum: null,
      maximum: null,
      exclusiveMinimum: null,
      exclusiveMaximum: null,
      multipleOf: null,
      items: null,
      minItems: null,
      maxItems: null,
      uniqueItems: null,
      properties: {},
      required: [],
      additionalProperties: null,
      allOf: null,
      anyOf: null,
      oneOf: null,
      not: null,
      title: null,
      description: null,
      default: null,
      examples: null,
      deprecated: false,
      nullable: false,
    };

    const result = schemaToZod(schema, sharedTypesDir);

    expect(result).toContain('z.enum');
    expect(result).toContain('active');
    expect(result).toContain('inactive');
  });

  it('should convert number type', () => {
    const schema: JSONSchema = {
      type: 'number',
      format: null,
      enum: null,
      const: null,
      minLength: null,
      maxLength: null,
      pattern: null,
      minimum: null,
      maximum: null,
      exclusiveMinimum: null,
      exclusiveMaximum: null,
      multipleOf: null,
      items: null,
      minItems: null,
      maxItems: null,
      uniqueItems: null,
      properties: {},
      required: [],
      additionalProperties: null,
      allOf: null,
      anyOf: null,
      oneOf: null,
      not: null,
      title: null,
      description: null,
      default: null,
      examples: null,
      deprecated: false,
      nullable: false,
    };

    const result = schemaToZod(schema, sharedTypesDir);

    expect(result).toBe('z.number()');
  });

  it('should convert integer type', () => {
    const schema: JSONSchema = {
      type: 'integer',
      format: null,
      enum: null,
      const: null,
      minLength: null,
      maxLength: null,
      pattern: null,
      minimum: null,
      maximum: null,
      exclusiveMinimum: null,
      exclusiveMaximum: null,
      multipleOf: null,
      items: null,
      minItems: null,
      maxItems: null,
      uniqueItems: null,
      properties: {},
      required: [],
      additionalProperties: null,
      allOf: null,
      anyOf: null,
      oneOf: null,
      not: null,
      title: null,
      description: null,
      default: null,
      examples: null,
      deprecated: false,
      nullable: false,
    };

    const result = schemaToZod(schema, sharedTypesDir);

    expect(result).toBe('z.number().int()');
  });

  it('should convert number with constraints', () => {
    const schema: JSONSchema = {
      type: 'number',
      format: null,
      enum: null,
      const: null,
      minLength: null,
      maxLength: null,
      pattern: null,
      minimum: 0,
      maximum: 100,
      exclusiveMinimum: 0,
      exclusiveMaximum: 100,
      multipleOf: 5,
      items: null,
      minItems: null,
      maxItems: null,
      uniqueItems: null,
      properties: {},
      required: [],
      additionalProperties: null,
      allOf: null,
      anyOf: null,
      oneOf: null,
      not: null,
      title: null,
      description: null,
      default: null,
      examples: null,
      deprecated: false,
      nullable: false,
    };

    const result = schemaToZod(schema, sharedTypesDir);

    expect(result).toContain('.min(0)');
    expect(result).toContain('.max(100)');
    expect(result).toContain('.gt(0)');
    expect(result).toContain('.lt(100)');
    expect(result).toContain('.multipleOf(5)');
  });

  it('should convert boolean type', () => {
    const schema: JSONSchema = {
      type: 'boolean',
      format: null,
      enum: null,
      const: null,
      minLength: null,
      maxLength: null,
      pattern: null,
      minimum: null,
      maximum: null,
      exclusiveMinimum: null,
      exclusiveMaximum: null,
      multipleOf: null,
      items: null,
      minItems: null,
      maxItems: null,
      uniqueItems: null,
      properties: {},
      required: [],
      additionalProperties: null,
      allOf: null,
      anyOf: null,
      oneOf: null,
      not: null,
      title: null,
      description: null,
      default: null,
      examples: null,
      deprecated: false,
      nullable: false,
    };

    const result = schemaToZod(schema, sharedTypesDir);

    expect(result).toBe('z.boolean()');
  });

  it('should convert array type', () => {
    const schema: JSONSchema = {
      type: 'array',
      format: null,
      enum: null,
      const: null,
      minLength: null,
      maxLength: null,
      pattern: null,
      minimum: null,
      maximum: null,
      exclusiveMinimum: null,
      exclusiveMaximum: null,
      multipleOf: null,
      items: {
        type: 'string',
        format: null,
        enum: null,
        const: null,
        minLength: null,
        maxLength: null,
        pattern: null,
        minimum: null,
        maximum: null,
        exclusiveMinimum: null,
        exclusiveMaximum: null,
        multipleOf: null,
        items: null,
        minItems: null,
        maxItems: null,
        uniqueItems: null,
        properties: {},
        required: [],
        additionalProperties: null,
        allOf: null,
        anyOf: null,
        oneOf: null,
        not: null,
        title: null,
        description: null,
        default: null,
        examples: null,
        deprecated: false,
        nullable: false,
      },
      minItems: null,
      maxItems: null,
      uniqueItems: null,
      properties: {},
      required: [],
      additionalProperties: null,
      allOf: null,
      anyOf: null,
      oneOf: null,
      not: null,
      title: null,
      description: null,
      default: null,
      examples: null,
      deprecated: false,
      nullable: false,
    };

    const result = schemaToZod(schema, sharedTypesDir);

    expect(result).toContain('z.array');
    expect(result).toContain('z.string()');
  });

  it('should convert array with constraints', () => {
    const schema: JSONSchema = {
      type: 'array',
      format: null,
      enum: null,
      const: null,
      minLength: null,
      maxLength: null,
      pattern: null,
      minimum: null,
      maximum: null,
      exclusiveMinimum: null,
      exclusiveMaximum: null,
      multipleOf: null,
      items: {
        type: 'string',
        format: null,
        enum: null,
        const: null,
        minLength: null,
        maxLength: null,
        pattern: null,
        minimum: null,
        maximum: null,
        exclusiveMinimum: null,
        exclusiveMaximum: null,
        multipleOf: null,
        items: null,
        minItems: null,
        maxItems: null,
        uniqueItems: null,
        properties: {},
        required: [],
        additionalProperties: null,
        allOf: null,
        anyOf: null,
        oneOf: null,
        not: null,
        title: null,
        description: null,
        default: null,
        examples: null,
        deprecated: false,
        nullable: false,
      },
      minItems: 1,
      maxItems: 10,
      uniqueItems: true,
      properties: {},
      required: [],
      additionalProperties: null,
      allOf: null,
      anyOf: null,
      oneOf: null,
      not: null,
      title: null,
      description: null,
      default: null,
      examples: null,
      deprecated: false,
      nullable: false,
    };

    const result = schemaToZod(schema, sharedTypesDir);

    expect(result).toContain('.min(1)');
    expect(result).toContain('.max(10)');
    expect(result).toContain('.unique()');
  });

  it('should convert object type', () => {
    const schema: JSONSchema = {
      type: 'object',
      format: null,
      enum: null,
      const: null,
      minLength: null,
      maxLength: null,
      pattern: null,
      minimum: null,
      maximum: null,
      exclusiveMinimum: null,
      exclusiveMaximum: null,
      multipleOf: null,
      items: null,
      minItems: null,
      maxItems: null,
      uniqueItems: null,
      properties: {
        name: {
          type: 'string',
          format: null,
          enum: null,
          const: null,
          minLength: null,
          maxLength: null,
          pattern: null,
          minimum: null,
          maximum: null,
          exclusiveMinimum: null,
          exclusiveMaximum: null,
          multipleOf: null,
          items: null,
          minItems: null,
          maxItems: null,
          uniqueItems: null,
          properties: {},
          required: [],
          additionalProperties: null,
          allOf: null,
          anyOf: null,
          oneOf: null,
          not: null,
          title: null,
          description: null,
          default: null,
          examples: null,
          deprecated: false,
          nullable: false,
        },
      },
      required: ['name'],
      additionalProperties: null,
      allOf: null,
      anyOf: null,
      oneOf: null,
      not: null,
      title: null,
      description: null,
      default: null,
      examples: null,
      deprecated: false,
      nullable: false,
    };

    const result = schemaToZod(schema, sharedTypesDir);

    expect(result).toContain('z.object');
    expect(result).toContain('name:');
    expect(result).toContain('z.string()');
  });

  it('should handle optional properties', () => {
    const schema: JSONSchema = {
      type: 'object',
      format: null,
      enum: null,
      const: null,
      minLength: null,
      maxLength: null,
      pattern: null,
      minimum: null,
      maximum: null,
      exclusiveMinimum: null,
      exclusiveMaximum: null,
      multipleOf: null,
      items: null,
      minItems: null,
      maxItems: null,
      uniqueItems: null,
      properties: {
        name: {
          type: 'string',
          format: null,
          enum: null,
          const: null,
          minLength: null,
          maxLength: null,
          pattern: null,
          minimum: null,
          maximum: null,
          exclusiveMinimum: null,
          exclusiveMaximum: null,
          multipleOf: null,
          items: null,
          minItems: null,
          maxItems: null,
          uniqueItems: null,
          properties: {},
          required: [],
          additionalProperties: null,
          allOf: null,
          anyOf: null,
          oneOf: null,
          not: null,
          title: null,
          description: null,
          default: null,
          examples: null,
          deprecated: false,
          nullable: false,
        },
      },
      required: [],
      additionalProperties: null,
      allOf: null,
      anyOf: null,
      oneOf: null,
      not: null,
      title: null,
      description: null,
      default: null,
      examples: null,
      deprecated: false,
      nullable: false,
    };

    const result = schemaToZod(schema, sharedTypesDir);

    expect(result).toContain('.optional()');
  });

  it('should handle nullable type', () => {
    const schema: JSONSchema = {
      type: 'string',
      format: null,
      enum: null,
      const: null,
      minLength: null,
      maxLength: null,
      pattern: null,
      minimum: null,
      maximum: null,
      exclusiveMinimum: null,
      exclusiveMaximum: null,
      multipleOf: null,
      items: null,
      minItems: null,
      maxItems: null,
      uniqueItems: null,
      properties: {},
      required: [],
      additionalProperties: null,
      allOf: null,
      anyOf: null,
      oneOf: null,
      not: null,
      title: null,
      description: null,
      default: null,
      examples: null,
      deprecated: false,
      nullable: true,
    };

    const result = schemaToZod(schema, sharedTypesDir);

    expect(result).toContain('.nullable()');
  });

  it('should handle union type with null', () => {
    const schema: JSONSchema = {
      type: ['string', 'null'],
      format: null,
      enum: null,
      const: null,
      minLength: null,
      maxLength: null,
      pattern: null,
      minimum: null,
      maximum: null,
      exclusiveMinimum: null,
      exclusiveMaximum: null,
      multipleOf: null,
      items: null,
      minItems: null,
      maxItems: null,
      uniqueItems: null,
      properties: {},
      required: [],
      additionalProperties: null,
      allOf: null,
      anyOf: null,
      oneOf: null,
      not: null,
      title: null,
      description: null,
      default: null,
      examples: null,
      deprecated: false,
      nullable: false,
    };

    const result = schemaToZod(schema, sharedTypesDir);

    expect(result).toContain('.nullable()');
  });

  it('should handle anyOf', () => {
    const schema: JSONSchema = {
      type: null,
      format: null,
      enum: null,
      const: null,
      minLength: null,
      maxLength: null,
      pattern: null,
      minimum: null,
      maximum: null,
      exclusiveMinimum: null,
      exclusiveMaximum: null,
      multipleOf: null,
      items: null,
      minItems: null,
      maxItems: null,
      uniqueItems: null,
      properties: {},
      required: [],
      additionalProperties: null,
      allOf: [
        { type: 'string' } as any,
        { type: 'number' } as any,
      ],
      anyOf: [
        { type: 'string' } as any,
        { type: 'number' } as any,
      ],
      oneOf: null,
      not: null,
      title: null,
      description: null,
      default: null,
      examples: null,
      deprecated: false,
      nullable: false,
    };

    const result = schemaToZod(schema, sharedTypesDir);

    expect(result).toContain('z.union');
  });

  it('should handle allOf', () => {
    const schema: JSONSchema = {
      type: null,
      format: null,
      enum: null,
      const: null,
      minLength: null,
      maxLength: null,
      pattern: null,
      minimum: null,
      maximum: null,
      exclusiveMinimum: null,
      exclusiveMaximum: null,
      multipleOf: null,
      items: null,
      minItems: null,
      maxItems: null,
      uniqueItems: null,
      properties: {},
      required: [],
      additionalProperties: null,
      allOf: [
        { type: 'object', properties: { a: { type: 'string' } } } as any,
        { type: 'object', properties: { b: { type: 'number' } } } as any,
      ],
      anyOf: null,
      oneOf: null,
      not: null,
      title: null,
      description: null,
      default: null,
      examples: null,
      deprecated: false,
      nullable: false,
    };

    const result = schemaToZod(schema, sharedTypesDir);

    expect(result).toContain('z.intersection');
  });
});


