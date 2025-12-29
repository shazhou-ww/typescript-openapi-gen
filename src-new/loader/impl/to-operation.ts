/**
 * toOperation(raw: unknown): Operation
 * - raw: 原始的 OpenAPI operation 对象
 * - 返回: 规范化的 Operation
 */

import type { Operation, Parameters, ResponseItem, Descriptions } from '../../types';
import { toJSONSchema, toRef, isRef } from './to-json-schema';

export function toOperation(raw: unknown): Operation {
  if (!raw || typeof raw !== 'object') {
    return createEmptyOperation();
  }

  const op = raw as Record<string, unknown>;

  return {
    ...extractDescriptions(op),
    operationId: typeof op['operationId'] === 'string' ? op['operationId'] : null,
    query: extractParametersByIn(op['parameters'], 'query'),
    body: extractRequestBody(op['requestBody']),
    headers: extractParametersByIn(op['parameters'], 'header'),
    cookie: extractParametersByIn(op['parameters'], 'cookie'),
    responses: extractResponses(op['responses']),
    deprecated: op['deprecated'] === true,
    tags: extractTags(op['tags']),
  };
}

function createEmptyOperation(): Operation {
  return {
    description: null, summary: null, operationId: null,
    query: {}, body: null, headers: {}, cookie: {},
    responses: {}, deprecated: false, tags: [],
  };
}

function extractDescriptions(obj: Record<string, unknown>): Descriptions {
  return {
    description: typeof obj['description'] === 'string' ? obj['description'] : null,
    summary: typeof obj['summary'] === 'string' ? obj['summary'] : null,
  };
}

function extractParametersByIn(params: unknown, location: string): Parameters {
  if (!Array.isArray(params)) return {};

  const result: Parameters = {};
  for (const param of params) {
    if (!param || typeof param !== 'object') continue;
    const p = param as Record<string, unknown>;
    if (p['in'] !== location) continue;
    const name = p['name'];
    if (typeof name !== 'string') continue;

    const schema = p['schema'];
    result[name] = isRef(schema) ? toRef(schema)! : toJSONSchema(schema);
  }
  return result;
}

function extractRequestBody(body: unknown): Operation['body'] {
  if (!body || typeof body !== 'object') return null;
  if (isRef(body)) return toRef(body);

  const b = body as Record<string, unknown>;
  const content = b['content'];
  if (!content || typeof content !== 'object') return null;

  // 优先查找 application/json
  const c = content as Record<string, unknown>;
  const jsonContent = c['application/json'] as Record<string, unknown> | undefined;
  if (jsonContent?.['schema']) {
    const schema = jsonContent['schema'];
    return isRef(schema) ? toRef(schema) : toJSONSchema(schema);
  }

  // 其次查找任意内容类型
  for (const [, mediaType] of Object.entries(c)) {
    if (mediaType && typeof mediaType === 'object') {
      const mt = mediaType as Record<string, unknown>;
      if (mt['schema']) {
        const schema = mt['schema'];
        return isRef(schema) ? toRef(schema) : toJSONSchema(schema);
      }
    }
  }

  return null;
}

function extractResponses(responses: unknown): Record<string, ResponseItem> {
  if (!responses || typeof responses !== 'object') return {};

  const result: Record<string, ResponseItem> = {};
  for (const [statusCode, response] of Object.entries(responses as Record<string, unknown>)) {
    result[statusCode] = extractResponseItem(response);
  }
  return result;
}

function extractResponseItem(response: unknown): ResponseItem {
  if (!response || typeof response !== 'object') {
    return { description: null, summary: null, content: null, headers: {} };
  }

  const r = response as Record<string, unknown>;
  return {
    ...extractDescriptions(r),
    content: extractResponseContent(r['content']),
    headers: extractResponseHeaders(r['headers']),
  };
}

function extractResponseContent(content: unknown): ResponseItem['content'] {
  if (!content || typeof content !== 'object') return null;

  const c = content as Record<string, unknown>;
  const jsonContent = c['application/json'] as Record<string, unknown> | undefined;
  if (jsonContent?.['schema']) {
    const schema = jsonContent['schema'];
    return isRef(schema) ? toRef(schema) : toJSONSchema(schema);
  }

  return null;
}

function extractResponseHeaders(headers: unknown): Parameters {
  if (!headers || typeof headers !== 'object') return {};

  const result: Parameters = {};
  for (const [name, header] of Object.entries(headers as Record<string, unknown>)) {
    if (!header || typeof header !== 'object') continue;
    const h = header as Record<string, unknown>;
    const schema = h['schema'];
    result[name] = isRef(schema) ? toRef(schema)! : toJSONSchema(schema);
  }
  return result;
}

function extractTags(tags: unknown): string[] {
  if (!Array.isArray(tags)) return [];
  return tags.filter((t): t is string => typeof t === 'string');
}

