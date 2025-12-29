/**
 * load(path: string): Promise<OpenApiDocument>
 * - path: OpenAPI 文件路径
 * - 返回: 规范化的 OpenApiDocument (IR)
 */

import SwaggerParser from '@apidevtools/swagger-parser';
import type { OpenAPI } from 'openapi-types';
import type { OpenApiDocument } from '../types';
import { toDocument } from './to-document';

export async function load(filePath: string): Promise<OpenApiDocument> {
  // swagger-parser 会自动解析所有 $ref（包括跨文件引用）
  const rawDoc = await SwaggerParser.dereference(filePath);
  return toDocument(rawDoc);
}
