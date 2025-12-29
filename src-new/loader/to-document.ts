/**
 * toDocument(raw: unknown): OpenApiDocument
 * - raw: 原始的 OpenAPI 文档对象
 * - 返回: 规范化的 OpenApiDocument (IR)
 */

import type { OpenApiDocument, JSONSchema } from '../types';
import { toPathItem } from './to-path-item';
import { toJSONSchema } from './to-json-schema';

export function toDocument(raw: unknown): OpenApiDocument {
  if (!raw || typeof raw !== 'object') {
    return { paths: {}, types: {} };
  }

  const doc = raw as Record<string, unknown>;

  return {
    paths: extractPaths(doc['paths']),
    types: extractTypes(doc['components']),
  };
}

function extractPaths(paths: unknown): OpenApiDocument['paths'] {
  if (!paths || typeof paths !== 'object') return {};

  const result: OpenApiDocument['paths'] = {};
  for (const [path, pathItem] of Object.entries(paths as Record<string, unknown>)) {
    result[path] = toPathItem(pathItem);
  }
  return result;
}

function extractTypes(components: unknown): Record<string, JSONSchema> {
  if (!components || typeof components !== 'object') return {};

  const c = components as Record<string, unknown>;
  const schemas = c['schemas'];
  if (!schemas || typeof schemas !== 'object') return {};

  const result: Record<string, JSONSchema> = {};
  for (const [name, schema] of Object.entries(schemas as Record<string, unknown>)) {
    result[name] = toJSONSchema(schema);
  }
  return result;
}

