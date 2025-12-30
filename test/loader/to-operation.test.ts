/**
 * to-operation.test.ts
 * 测试 toOperation 函数
 */

import { describe, it, expect } from 'vitest';
import { toOperation } from '../../src/loader/to-operation';
import type { Operation } from '../../src/types';

describe('toOperation', () => {
  it('should create empty operation for null input', () => {
    const op = toOperation(null);

    expect(op.description).toBeNull();
    expect(op.summary).toBeNull();
    expect(op.operationId).toBeNull();
    expect(op.query).toEqual({});
    expect(op.body).toBeNull();
    expect(op.headers).toEqual({});
    expect(op.cookie).toEqual({});
    expect(op.responses).toEqual({});
    expect(op.deprecated).toBe(false);
    expect(op.tags).toEqual([]);
  });

  it('should extract descriptions', () => {
    const op = toOperation({
      description: 'Operation description',
      summary: 'Operation summary',
    });

    expect(op.description).toBe('Operation description');
    expect(op.summary).toBe('Operation summary');
  });

  it('should extract operationId', () => {
    const op = toOperation({
      operationId: 'getUsers',
    });

    expect(op.operationId).toBe('getUsers');
  });

  it('should extract query parameters', () => {
    const op = toOperation({
      parameters: [
        {
          name: 'page',
          in: 'query',
          schema: { type: 'number' },
        },
        {
          name: 'limit',
          in: 'query',
          schema: { type: 'number' },
        },
      ],
    });

    expect(op.query.page).toBeDefined();
    expect(op.query.limit).toBeDefined();
  });

  it('should extract header parameters', () => {
    const op = toOperation({
      parameters: [
        {
          name: 'Authorization',
          in: 'header',
          schema: { type: 'string' },
        },
      ],
    });

    expect(op.headers.Authorization).toBeDefined();
  });

  it('should extract cookie parameters', () => {
    const op = toOperation({
      parameters: [
        {
          name: 'sessionId',
          in: 'cookie',
          schema: { type: 'string' },
        },
      ],
    });

    expect(op.cookie.sessionId).toBeDefined();
  });

  it('should extract request body with application/json', () => {
    const op = toOperation({
      requestBody: {
        content: {
          'application/json': {
            schema: { type: 'object' },
          },
        },
      },
    });

    expect(op.body).toBeDefined();
  });

  it('should extract request body with any content type', () => {
    const op = toOperation({
      requestBody: {
        content: {
          'application/xml': {
            schema: { type: 'object' },
          },
        },
      },
    });

    expect(op.body).toBeDefined();
  });

  it('should extract responses', () => {
    const op = toOperation({
      responses: {
        '200': {
          description: 'Success',
          content: {
            'application/json': {
              schema: { type: 'object' },
            },
          },
        },
        '404': {
          description: 'Not found',
        },
      },
    });

    expect(op.responses['200']).toBeDefined();
    expect(op.responses['404']).toBeDefined();
    expect(op.responses['200']?.description).toBe('Success');
  });

  it('should extract response headers', () => {
    const op = toOperation({
      responses: {
        '200': {
          headers: {
            'X-Total-Count': {
              schema: { type: 'number' },
            },
          },
        },
      },
    });

    expect(op.responses['200']?.headers['X-Total-Count']).toBeDefined();
  });

  it('should extract deprecated flag', () => {
    const op = toOperation({
      deprecated: true,
    });

    expect(op.deprecated).toBe(true);
  });

  it('should extract tags', () => {
    const op = toOperation({
      tags: ['users', 'admin'],
    });

    expect(op.tags).toEqual(['users', 'admin']);
  });

  it('should handle ref in request body', () => {
    const op = toOperation({
      requestBody: {
        $ref: '#/components/schemas/User',
      },
    });

    expect(op.body).toBeDefined();
    expect((op.body as any).$ref).toBeDefined();
  });
});

