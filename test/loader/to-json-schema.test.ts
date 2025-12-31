/**
 * to-json-schema.test.ts
 * 测试 toJSONSchema, toRef, isRef 函数
 */

import { describe, it, expect } from 'vitest';
import { toJSONSchema, toRef, isRef } from '../../src/loader/to-json-schema';
import type { JSONSchema, Ref } from '../../src/types';

describe('toJSONSchema', () => {
  it('should create empty schema for null input', () => {
    const schema = toJSONSchema(null);

    expect(schema.type).toBeNull();
    expect(schema.format).toBeNull();
    expect(schema.properties).toEqual({});
    expect(schema.required).toEqual([]);
  });

  it('should normalize string type', () => {
    const schema = toJSONSchema({ type: 'string' });

    expect(schema.type).toBe('string');
  });

  it('should normalize array type', () => {
    const schema = toJSONSchema({ type: ['string', 'null'] });

    expect(schema.type).toEqual(['string', 'null']);
  });

  it('should normalize format', () => {
    const schema = toJSONSchema({ type: 'string', format: 'email' });

    expect(schema.format).toBe('email');
  });

  it('should normalize enum', () => {
    const schema = toJSONSchema({ type: 'string', enum: ['a', 'b', 'c'] });

    expect(schema.enum).toEqual(['a', 'b', 'c']);
  });

  it('should normalize const', () => {
    const schema = toJSONSchema({ type: 'string', const: 'fixed' });

    expect(schema.const).toBe('fixed');
  });

  it('should normalize string constraints', () => {
    const schema = toJSONSchema({
      type: 'string',
      minLength: 1,
      maxLength: 100,
      pattern: '^[a-z]+$',
    });

    expect(schema.minLength).toBe(1);
    expect(schema.maxLength).toBe(100);
    expect(schema.pattern).toBe('^[a-z]+$');
  });

  it('should normalize number constraints', () => {
    const schema = toJSONSchema({
      type: 'number',
      minimum: 0,
      maximum: 100,
      exclusiveMinimum: 0,
      exclusiveMaximum: 100,
      multipleOf: 5,
    });

    expect(schema.minimum).toBe(0);
    expect(schema.maximum).toBe(100);
    expect(schema.exclusiveMinimum).toBe(0);
    expect(schema.exclusiveMaximum).toBe(100);
    expect(schema.multipleOf).toBe(5);
  });

  it('should normalize array constraints', () => {
    const schema = toJSONSchema({
      type: 'array',
      items: { type: 'string' },
      minItems: 1,
      maxItems: 10,
      uniqueItems: true,
    });

    expect(schema.minItems).toBe(1);
    expect(schema.maxItems).toBe(10);
    expect(schema.uniqueItems).toBe(true);
    expect(schema.items).not.toBeNull();
  });

  it('should normalize object properties', () => {
    const schema = toJSONSchema({
      type: 'object',
      properties: {
        name: { type: 'string' },
        age: { type: 'number' },
      },
      required: ['name'],
    });

    expect(schema.properties).toHaveProperty('name');
    expect(schema.properties).toHaveProperty('age');
    expect(schema.required).toEqual(['name']);
  });

  it('should normalize composition schemas', () => {
    const schema = toJSONSchema({
      allOf: [{ type: 'string' }],
      anyOf: [{ type: 'number' }],
      oneOf: [{ type: 'boolean' }],
      not: { type: 'null' },
    });

    expect(schema.allOf).not.toBeNull();
    expect(schema.anyOf).not.toBeNull();
    expect(schema.oneOf).not.toBeNull();
    expect(schema.not).not.toBeNull();
  });

  it('should normalize metadata', () => {
    const schema = toJSONSchema({
      title: 'User',
      description: 'User schema',
      default: { name: 'John' },
      examples: [{ name: 'Jane' }],
      deprecated: true,
      nullable: true,
    });

    expect(schema.title).toBe('User');
    expect(schema.description).toBe('User schema');
    expect(schema.default).toEqual({ name: 'John' });
    expect(schema.examples).toEqual([{ name: 'Jane' }]);
    expect(schema.deprecated).toBe(true);
    expect(schema.nullable).toBe(true);
  });
});

describe('toRef', () => {
  it('should convert ref object to Ref type', () => {
    const ref = toRef({ $ref: '#/components/schemas/User' });

    expect(ref).not.toBeNull();
    expect(ref?.$ref).toBe('User');
  });

  it('should extract type name from ref path', () => {
    const ref = toRef({ $ref: '#/components/schemas/UserType' });

    expect(ref?.$ref).toBe('UserType');
  });

  it('should return null for non-ref object', () => {
    const ref = toRef({ type: 'string' });

    expect(ref).toBeNull();
  });

  it('should return null for null input', () => {
    const ref = toRef(null);

    expect(ref).toBeNull();
  });

  it('should handle ref without prefix', () => {
    const ref = toRef({ $ref: 'User' });

    expect(ref?.$ref).toBe('User');
  });
});

describe('isRef', () => {
  it('should return true for ref object', () => {
    expect(isRef({ $ref: '#/components/schemas/User' })).toBe(true);
  });

  it('should return false for schema object', () => {
    expect(isRef({ type: 'string' })).toBe(false);
  });

  it('should return false for null', () => {
    expect(isRef(null)).toBe(false);
  });

  it('should return false for primitive values', () => {
    expect(isRef('string')).toBe(false);
    expect(isRef(123)).toBe(false);
    expect(isRef(true)).toBe(false);
  });
});


