/**
 * runner.test.ts
 * 测试 runAnalysis 函数
 */

import { describe, it, expect } from 'vitest';
import { runAnalysis } from '../../src/analyzers/runner';
import type { OpenApiDocument, AnalysisTask } from '../../src/types';

describe('runAnalysis', () => {
  const validDoc: OpenApiDocument = {
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

  it('should run structure analyzer', async () => {
    const task: AnalysisTask = {
      type: 'analysis',
      analyzers: ['structure'],
    };

    const result = await runAnalysis(validDoc, task);

    expect(result.success).toBe(true);
    expect(result.diagnostics).toHaveLength(0);
  });

  it('should run refs analyzer', async () => {
    const task: AnalysisTask = {
      type: 'analysis',
      analyzers: ['refs'],
    };

    const result = await runAnalysis(validDoc, task);

    expect(result.success).toBe(true);
    expect(result.diagnostics).toHaveLength(0);
  });

  it('should run multiple analyzers', async () => {
    const task: AnalysisTask = {
      type: 'analysis',
      analyzers: ['structure', 'refs'],
    };

    const result = await runAnalysis(validDoc, task);

    expect(result.success).toBe(true);
  });

  it('should return error for unknown analyzer', async () => {
    const task: AnalysisTask = {
      type: 'analysis',
      analyzers: ['unknown' as any],
    };

    const result = await runAnalysis(validDoc, task);

    expect(result.success).toBe(false);
    expect(result.diagnostics).toHaveLength(1);
    expect(result.diagnostics[0]).toMatchObject({
      type: 'error',
      code: 'UNKNOWN_ANALYZER',
    });
  });

  it('should return success false when analyzer finds errors', async () => {
    const docWithError: OpenApiDocument = {
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

    const task: AnalysisTask = {
      type: 'analysis',
      analyzers: ['refs'],
    };

    const result = await runAnalysis(docWithError, task);

    expect(result.success).toBe(false);
    expect(result.diagnostics.some(d => d.type === 'error')).toBe(true);
  });
});


