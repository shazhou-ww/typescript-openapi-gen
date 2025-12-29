/**
 * createLoader(): LoaderAPI
 * - 返回: 包含加载和转换功能的完整 Loader API
 */
import type { OpenApiDocument, IR } from '../../types';
import type { Loader, LoaderAPI } from '../types';
import { readFileContent } from './file-reader';
import { parseDocumentContent } from './document-parser';
import { validateOpenApiDocument } from './document-validator';
import { resolveExternalRefs } from './ref-resolver';
import { documentToIR } from './document-to-ir';

export function createLoader(): LoaderAPI {
  const load: Loader = async (filePath: string): Promise<OpenApiDocument> => {
    // 读取文件内容
    const content = readFileContent(filePath);

    // 解析文档
    const doc = parseDocumentContent(content, filePath);

    // 验证文档结构
    validateOpenApiDocument(doc);

    // 解析外部引用
    const resolvedDoc = await resolveExternalRefs(doc as OpenApiDocument, '');

    return resolvedDoc;
  };

  const toIR = (document: OpenApiDocument): IR => {
    return documentToIR(document);
  };

  return { load, toIR };
}
