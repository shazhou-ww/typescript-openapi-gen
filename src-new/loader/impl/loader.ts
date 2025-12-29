/**
 * load(path: string): Promise<OpenApiDocument>
 * - path: OpenAPI 文件路径
 * - 返回: 规范化的 OpenApiDocument (IR)
 */

import type { OpenApiDocument } from '../../types';
import { readFileContent } from './file-reader';
import { parseDocumentContent } from './document-parser';
import { validateOpenApiDocument } from './document-validator';
import { toDocument } from './to-document';

export async function load(filePath: string): Promise<OpenApiDocument> {
  const content = readFileContent(filePath);
  const rawDoc = parseDocumentContent(content, filePath);
  validateOpenApiDocument(rawDoc);
  return toDocument(rawDoc);
}
