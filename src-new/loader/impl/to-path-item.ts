/**
 * toPathItem(raw: unknown): PathItem
 * - raw: 原始的 OpenAPI path item 对象
 * - 返回: 规范化的 PathItem
 */

import type { PathItem, Method, Parameters, Descriptions } from '../../types';
import { toOperation } from './to-operation';
import { toJSONSchema, toRef, isRef } from './to-json-schema';

const METHODS: Method[] = ['get', 'post', 'put', 'delete', 'patch', 'options', 'head'];

export function toPathItem(raw: unknown): PathItem {
  if (!raw || typeof raw !== 'object') {
    return createEmptyPathItem();
  }

  const item = raw as Record<string, unknown>;

  return {
    ...extractDescriptions(item),
    operations: extractOperations(item),
    parameters: extractPathParameters(item['parameters']),
  };
}

function createEmptyPathItem(): PathItem {
  return {
    description: null,
    summary: null,
    operations: {},
    parameters: {},
  };
}

function extractDescriptions(obj: Record<string, unknown>): Descriptions {
  return {
    description: typeof obj['description'] === 'string' ? obj['description'] : null,
    summary: typeof obj['summary'] === 'string' ? obj['summary'] : null,
  };
}

function extractOperations(item: Record<string, unknown>): PathItem['operations'] {
  const operations: PathItem['operations'] = {};

  for (const method of METHODS) {
    const op = item[method];
    if (op && typeof op === 'object') {
      operations[method] = toOperation(op);
    }
  }

  return operations;
}

function extractPathParameters(params: unknown): Parameters {
  if (!Array.isArray(params)) return {};

  const result: Parameters = {};
  for (const param of params) {
    if (!param || typeof param !== 'object') continue;
    const p = param as Record<string, unknown>;
    if (p['in'] !== 'path') continue;
    const name = p['name'];
    if (typeof name !== 'string') continue;

    const schema = p['schema'];
    result[name] = isRef(schema) ? toRef(schema)! : toJSONSchema(schema);
  }
  return result;
}

