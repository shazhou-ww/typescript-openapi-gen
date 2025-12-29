/**
 * parseOperations(document: OpenAPI 文档对象): any[]
 * - document: OpenAPI 文档对象
 * - 返回: 所有操作对象的数组
 */
import type { OpenApiDocument } from '../../types';

export function parseOperations(document: OpenApiDocument): any[] {
  const operations: any[] = [];

  if (document.paths) {
    for (const [path, pathItem] of Object.entries(document.paths)) {
      if (pathItem) {
        const methods = ['get', 'post', 'put', 'delete', 'patch', 'options', 'head'] as const;
        for (const method of methods) {
          if (pathItem[method]) {
            operations.push({
              path,
              method,
              operation: pathItem[method],
            });
          }
        }
      }
    }
  }

  return operations;
}
