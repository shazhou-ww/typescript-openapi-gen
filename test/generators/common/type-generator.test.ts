/**
 * type-generator.test.ts
 * 测试 schemaToTypeScript 函数
 */

import { describe, it, expect } from 'vitest';
import { schemaToTypeScript } from '../../../src/generators/common/type-generator';
import type { JSONSchema, Ref } from '../../../src/types';

describe('schemaToTypeScript', () => {
  it('should convert ref to type name', () => {
    const ref: Ref = { $ref: 'User' };
    const result = schemaToTypeScript(ref);

    expect(result).toBe('User');
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

    const result = schemaToTypeScript(schema);

    expect(result).toBe('string');
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

    const result = schemaToTypeScript(schema);

    expect(result).toBe('number');
  });

  it('should convert integer type to number', () => {
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

    const result = schemaToTypeScript(schema);

    expect(result).toBe('number');
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

    const result = schemaToTypeScript(schema);

    expect(result).toBe('boolean');
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

    const result = schemaToTypeScript(schema);

    expect(result).toBe('string[]');
  });

  it('should convert array with ref items', () => {
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
      items: { $ref: 'User' },
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

    const result = schemaToTypeScript(schema);

    expect(result).toBe('User[]');
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
        age: {
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

    const result = schemaToTypeScript(schema);

    expect(result).toContain('name: string');
    expect(result).toContain('age?: number');
  });

  it('should convert empty object to Record', () => {
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

    const result = schemaToTypeScript(schema);

    expect(result).toBe('Record<string, unknown>');
  });

  it('should convert union type', () => {
    const schema: JSONSchema = {
      type: ['string', 'number'],
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

    const result = schemaToTypeScript(schema);

    expect(result).toBe('string | number');
  });

  it('should return unknown for null type', () => {
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

    const result = schemaToTypeScript(schema);

    expect(result).toBe('Record<string, unknown>');
  });
});


