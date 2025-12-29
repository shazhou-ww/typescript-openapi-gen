/**
 * parseSchemas(document: OpenApiDocument): Map<string, any>
 * - document: OpenAPI 文档对象
 * - 返回: schema 名称到 schema 定义的映射表
 */
import type { OpenApiDocument } from '../../types';

export function parseSchemas(document: OpenApiDocument): Map<string, any> {
  const schemas = new Map<string, any>();

  if (document.components?.schemas) {
    for (const [name, schema] of Object.entries(document.components.schemas)) {
      schemas.set(name, schema);
    }
  }

  return schemas;
}
