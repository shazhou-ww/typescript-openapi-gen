/**
 * to-path-item.test.ts
 * 测试 toPathItem 函数
 */

import { describe, it, expect } from 'vitest';
import { toPathItem } from '../../src/loader/to-path-item';
import type { PathItem } from '../../src/types';

describe('toPathItem', () => {
  it('should create empty path item for null input', () => {
    const item = toPathItem(null);

    expect(item.description).toBeNull();
    expect(item.summary).toBeNull();
    expect(item.operations).toEqual({});
    expect(item.parameters).toEqual({});
  });

  it('should extract descriptions', () => {
    const item = toPathItem({
      description: 'Path description',
      summary: 'Path summary',
    });

    expect(item.description).toBe('Path description');
    expect(item.summary).toBe('Path summary');
  });

  it('should extract operations', () => {
    const item = toPathItem({
      get: {
        operationId: 'getUsers',
        responses: {},
      },
      post: {
        operationId: 'createUser',
        responses: {},
      },
    });

    expect(item.operations.get).toBeDefined();
    expect(item.operations.post).toBeDefined();
    expect(item.operations.get?.operationId).toBe('getUsers');
    expect(item.operations.post?.operationId).toBe('createUser');
  });

  it('should extract path parameters', () => {
    const item = toPathItem({
      parameters: [
        {
          name: 'id',
          in: 'path',
          schema: { type: 'string' },
        },
      ],
    });

    expect(item.parameters.id).toBeDefined();
  });

  it('should ignore non-path parameters', () => {
    const item = toPathItem({
      parameters: [
        {
          name: 'filter',
          in: 'query',
          schema: { type: 'string' },
        },
      ],
    });

    expect(item.parameters).toEqual({});
  });

  it('should handle empty parameters array', () => {
    const item = toPathItem({
      parameters: [],
    });

    expect(item.parameters).toEqual({});
  });

  it('should handle all HTTP methods', () => {
    const item = toPathItem({
      get: { responses: {} },
      post: { responses: {} },
      put: { responses: {} },
      delete: { responses: {} },
      patch: { responses: {} },
      options: { responses: {} },
      head: { responses: {} },
    });

    expect(item.operations.get).toBeDefined();
    expect(item.operations.post).toBeDefined();
    expect(item.operations.put).toBeDefined();
    expect(item.operations.delete).toBeDefined();
    expect(item.operations.patch).toBeDefined();
    expect(item.operations.options).toBeDefined();
    expect(item.operations.head).toBeDefined();
  });
});


