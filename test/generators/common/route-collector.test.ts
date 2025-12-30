/**
 * route-collector.test.ts
 * 测试 collectRoutes 函数
 */

import { describe, it, expect } from 'vitest';
import { collectRoutes } from '../../../src/generators/common/route-collector';
import type { OpenApiDocument } from '../../../src/types';

describe('collectRoutes', () => {
  it('should collect routes from document', () => {
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

    const routes = collectRoutes(doc);

    expect(routes).toHaveLength(1);
    expect(routes[0]).toMatchObject({
      path: '/users',
      method: 'get',
      handlerName: 'handleGet',
      controllerPath: 'users',
      controllerImportPath: ['users'],
    });
  });

  it('should handle path parameters', () => {
    const doc: OpenApiDocument = {
      paths: {
        '/users/{id}': {
          description: null,
          summary: null,
          operations: {
            get: {
              description: null,
              summary: null,
              operationId: 'getUser',
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

    const routes = collectRoutes(doc);

    expect(routes).toHaveLength(1);
    expect(routes[0].controllerPath).toBe('users/_id');
    expect(routes[0].controllerImportPath).toEqual(['users', '_id']);
  });

  it('should collect multiple routes', () => {
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
            post: {
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

    const routes = collectRoutes(doc);

    expect(routes).toHaveLength(2);
    expect(routes[0].method).toBe('get');
    expect(routes[1].method).toBe('post');
  });

  it('should sort routes by path and method', () => {
    const doc: OpenApiDocument = {
      paths: {
        '/posts': {
          description: null,
          summary: null,
          operations: {
            post: {
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

    const routes = collectRoutes(doc);

    expect(routes[0].path).toBe('/posts');
    expect(routes[1].path).toBe('/users');
  });

  it('should generate correct handler names', () => {
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
            post: {
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
            put: {
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

    const routes = collectRoutes(doc);

    expect(routes.find(r => r.method === 'get')?.handlerName).toBe('handleGet');
    expect(routes.find(r => r.method === 'post')?.handlerName).toBe('handlePost');
    expect(routes.find(r => r.method === 'put')?.handlerName).toBe('handlePut');
  });

  it('should handle empty paths', () => {
    const doc: OpenApiDocument = {
      paths: {},
      types: {},
    };

    const routes = collectRoutes(doc);

    expect(routes).toHaveLength(0);
  });

  it('should skip null operations', () => {
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
            post: null as any,
          },
          parameters: {},
        },
      },
      types: {},
    };

    const routes = collectRoutes(doc);

    expect(routes).toHaveLength(1);
    expect(routes[0].method).toBe('get');
  });
});

