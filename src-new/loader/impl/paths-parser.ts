/**
 * parsePaths(document: OpenApiDocument): Map<string, any>
 * - document: OpenAPI 文档对象
 * - 返回: 路径到路径项的映射表
 */
import type { OpenApiDocument } from '../../types';

export function parsePaths(document: OpenApiDocument): Map<string, any> {
  const paths = new Map<string, any>();

  if (document.paths) {
    for (const [path, pathItem] of Object.entries(document.paths)) {
      paths.set(path, pathItem);
    }
  }

  return paths;
}
