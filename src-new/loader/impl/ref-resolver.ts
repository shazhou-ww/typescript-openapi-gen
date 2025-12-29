/**
 * resolveExternalRefs(doc: OpenApiDocument, baseDir: string): Promise<OpenApiDocument>
 * - doc: OpenAPI 文档对象
 * - baseDir: 文档所在目录的基础路径
 * - 返回: 解析完外部引用后的文档对象
 */
import type { OpenApiDocument } from '../../types';

export async function resolveExternalRefs(doc: OpenApiDocument, _baseDir: string): Promise<OpenApiDocument> {
  // 这里应该实现引用解析逻辑
  // 暂时返回原始文档
  return doc;
}
