/**
 * documentToIR(document: OpenApiDocument): IR
 * - document: OpenAPI 文档对象
 * - 返回: 转换后的中间表示对象
 */
import type { OpenApiDocument, IR } from '../../types';
import { parsePaths } from './paths-parser';
import { parseSchemas } from './schemas-parser';
import { parseOperations } from './operations-parser';

export function documentToIR(document: OpenApiDocument): IR {
  const paths = parsePaths(document);
  const schemas = parseSchemas(document);
  const operations = parseOperations(document);

  return {
    document,
    paths,
    schemas,
    operations,
  };
}
