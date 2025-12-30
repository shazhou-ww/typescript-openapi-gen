/**
 * to-document.test.ts
 * 测试 toDocument 函数
 */

import { describe, it, expect } from 'vitest';
import { toDocument } from '../../src/loader/to-document';
import type { OpenAPI } from 'openapi-types';

describe('toDocument', () => {
  it('should convert minimal OpenAPI document', () => {
    const raw: OpenAPI.Document = {
      openapi: '3.0.0',
      info: {
        title: 'Test API',
        version: '1.0.0',
      },
      paths: {},
    };

    const doc = toDocument(raw);

    expect(doc.paths).toEqual({});
    expect(doc.types).toEqual({});
  });

  it('should extract paths', () => {
    const raw: OpenAPI.Document = {
      openapi: '3.0.0',
      info: {
        title: 'Test API',
        version: '1.0.0',
      },
      paths: {
        '/users': {
          get: {
            responses: {},
          },
        },
      },
    };

    const doc = toDocument(raw);

    expect(doc.paths).toHaveProperty('/users');
    expect(doc.paths['/users'].operations.get).toBeDefined();
  });

  it('should extract types from components.schemas', () => {
    const raw: OpenAPI.Document = {
      openapi: '3.0.0',
      info: {
        title: 'Test API',
        version: '1.0.0',
      },
      paths: {},
      components: {
        schemas: {
          User: {
            type: 'object',
            properties: {
              name: { type: 'string' },
            },
          },
        },
      },
    };

    const doc = toDocument(raw);

    expect(doc.types).toHaveProperty('User');
    expect(doc.types.User.type).toBe('object');
  });

  it('should handle document without components', () => {
    const raw: OpenAPI.Document = {
      openapi: '3.0.0',
      info: {
        title: 'Test API',
        version: '1.0.0',
      },
      paths: {},
    };

    const doc = toDocument(raw);

    expect(doc.types).toEqual({});
  });

  it('should handle document with empty components', () => {
    const raw: OpenAPI.Document = {
      openapi: '3.0.0',
      info: {
        title: 'Test API',
        version: '1.0.0',
      },
      paths: {},
      components: {},
    };

    const doc = toDocument(raw);

    expect(doc.types).toEqual({});
  });

  it('should handle multiple paths and types', () => {
    const raw: OpenAPI.Document = {
      openapi: '3.0.0',
      info: {
        title: 'Test API',
        version: '1.0.0',
      },
      paths: {
        '/users': {
          get: { responses: {} },
        },
        '/posts': {
          get: { responses: {} },
        },
      },
      components: {
        schemas: {
          User: { type: 'object' },
          Post: { type: 'object' },
        },
      },
    };

    const doc = toDocument(raw);

    expect(Object.keys(doc.paths)).toHaveLength(2);
    expect(Object.keys(doc.types)).toHaveLength(2);
  });
});

