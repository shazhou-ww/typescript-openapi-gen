/**
 * structure-analyzer.test.ts
 * 测试 analyzeStructure 函数
 */

import { describe, it, expect } from 'vitest';
import { analyzeStructure } from '../../src/analyzers/structure-analyzer';
import type { OpenApiDocument } from '../../src/types';

describe('analyzeStructure', () => {
  it('should return warning when no paths defined', () => {
    const doc: OpenApiDocument = {
      paths: {},
      types: {},
    };

    const diagnostics = analyzeStructure(doc);

    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0]).toMatchObject({
      type: 'warning',
      message: 'No paths defined in the document',
      code: 'NO_PATHS',
    });
  });

  it('should return warning when path has no operations', () => {
    const doc: OpenApiDocument = {
      paths: {
        '/users': {
          description: null,
          summary: null,
          operations: {},
          parameters: {},
        },
      },
      types: {},
    };

    const diagnostics = analyzeStructure(doc);

    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0]).toMatchObject({
      type: 'warning',
      message: "Path '/users' has no operations defined",
      code: 'NO_OPERATIONS',
    });
  });

  it('should return no diagnostics for valid document', () => {
    const doc: OpenApiDocument = {
      paths: {
        '/users': {
          description: null,
          summary: null,
          operations: {
            get: {
              description: null,
              summary: null,
              operationId: 'getUsers',
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

    const diagnostics = analyzeStructure(doc);

    expect(diagnostics).toHaveLength(0);
  });

  it('should check all paths', () => {
    const doc: OpenApiDocument = {
      paths: {
        '/users': {
          description: null,
          summary: null,
          operations: {},
          parameters: {},
        },
        '/posts': {
          description: null,
          summary: null,
          operations: {},
          parameters: {},
        },
      },
      types: {},
    };

    const diagnostics = analyzeStructure(doc);

    expect(diagnostics).toHaveLength(2);
    expect(diagnostics.every(d => d.code === 'NO_OPERATIONS')).toBe(true);
  });
});


