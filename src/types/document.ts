/**
 * OpenApiDocument 类型定义（IR）
 * 
 * 导出: OpenApiDocument, PathItem, Operation, ResponseItem, Parameters, Method, Descriptions
 * 
 * OpenApiDocument: 规范化的 OpenAPI 文档表示，作为内部 IR 使用
 */

import type { JSONSchema, Ref } from './json-schema';

export type Method = 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head';

export type Descriptions = {
  description: string | null;
  summary: string | null;
};

export type Parameters = Record<string, JSONSchema | Ref>;

export type ResponseItem = Descriptions & {
  content: JSONSchema | Ref | null;
  headers: Parameters;
};

export type Operation = Descriptions & {
  operationId: string | null;
  query: Parameters;
  body: JSONSchema | Ref | null;
  headers: Parameters;
  cookie: Parameters;
  responses: Record<string, ResponseItem>;
  deprecated: boolean;
  tags: string[];
};

export type PathItem = Descriptions & {
  operations: Partial<Record<Method, Operation>>;
  parameters: Parameters;
};

export type OpenApiDocument = {
  paths: Record<string, PathItem>;
  types: Record<string, JSONSchema>;
};

