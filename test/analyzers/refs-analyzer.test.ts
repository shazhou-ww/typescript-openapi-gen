/**
 * refs-analyzer.test.ts
 * 测试 analyzeRefs 函数
 */

import { describe, it, expect } from 'vitest';
import { analyzeRefs } from '../../src/analyzers/refs-analyzer';
import type { OpenApiDocument } from '../../src/types';

describe('analyzeRefs', () => {
  it('should return no diagnostics for document without refs', () => {
    const doc: OpenApiDocument = {
      paths: {
        '/users': {
          description: null,
          summary: null,
          operations: {
            get: {
              description: null,
              summary: null,
              operationId: null,
              query: {},
              body: null,
              headers: {},
              cookie: {},
              responses: {},
              deprecated: false,
              tags: [],
            },
          },
          parameters: {},
        },
      },
      types: {},
    };

    const diagnostics = analyzeRefs(doc);

    expect(diagnostics).toHaveLength(0);
  });

  it('should return error for undefined ref in query parameter', () => {
    const doc: OpenApiDocument = {
      paths: {
        '/users': {
          description: null,
          summary: null,
          operations: {
            get: {
              description: null,
              summary: null,
              operationId: null,
              query: {
                filter: { $ref: 'UndefinedType' },
              },
              body: null,
              headers: {},
              cookie: {},
              responses: {},
              deprecated: false,
              tags: [],
            },
          },
          parameters: {},
        },
      },
      types: {},
    };

    const diagnostics = analyzeRefs(doc);

    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0]).toMatchObject({
      type: 'error',
      message: "Reference 'UndefinedType' is not defined in types",
      code: 'UNDEFINED_REF',
    });
  });

  it('should return no error for defined ref', () => {
    const doc: OpenApiDocument = {
      paths: {
        '/users': {
          description: null,
          summary: null,
          operations: {
            get: {
              description: null,
              summary: null,
              operationId: null,
              query: {
                filter: { $ref: 'FilterType' },
              },
              body: null,
              headers: {},
              cookie: {},
              responses: {},
              deprecated: false,
              tags: [],
            },
          },
          parameters: {},
        },
      },
      types: {
        FilterType: {
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
        },
      },
    };

    const diagnostics = analyzeRefs(doc);

    expect(diagnostics).toHaveLength(0);
  });

  it('should check refs in path parameters', () => {
    const doc: OpenApiDocument = {
      paths: {
        '/users/{id}': {
          description: null,
          summary: null,
          operations: {},
          parameters: {
            id: { $ref: 'UndefinedType' },
          },
        },
      },
      types: {},
    };

    const diagnostics = analyzeRefs(doc);

    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].code).toBe('UNDEFINED_REF');
  });

  it('should check refs in body', () => {
    const doc: OpenApiDocument = {
      paths: {
        '/users': {
          description: null,
          summary: null,
          operations: {
            post: {
              description: null,
              summary: null,
              operationId: null,
              query: {},
              body: { $ref: 'UndefinedType' },
              headers: {},
              cookie: {},
              responses: {},
              deprecated: false,
              tags: [],
            },
          },
          parameters: {},
        },
      },
      types: {},
    };

    const diagnostics = analyzeRefs(doc);

    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].code).toBe('UNDEFINED_REF');
  });

  it('should check refs in response content', () => {
    const doc: OpenApiDocument = {
      paths: {
        '/users': {
          description: null,
          summary: null,
          operations: {
            get: {
              description: null,
              summary: null,
              operationId: null,
              query: {},
              body: null,
              headers: {},
              cookie: {},
              responses: {
                '200': {
                  description: null,
                  summary: null,
                  content: { $ref: 'UndefinedType' },
                  headers: {},
                },
              },
              deprecated: false,
              tags: [],
            },
          },
          parameters: {},
        },
      },
      types: {},
    };

    const diagnostics = analyzeRefs(doc);

    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].code).toBe('UNDEFINED_REF');
  });
});

