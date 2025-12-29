import * as fs from 'node:fs';
import * as path from 'node:path';
import * as yaml from 'js-yaml';
import { OpenApiDocument, IR } from '../../types';

/**
 * Loader 函数类型，负责加载和解析 OpenAPI document
 */
export type Loader = (filePath: string) => Promise<OpenApiDocument>;

/**
 * 默认的 OpenAPI 文件加载器
 */
export const createOpenApiLoader = (): Loader => {
  return async (filePath: string): Promise<OpenApiDocument> => {
    const absolutePath = path.resolve(filePath);

    // 检查文件是否存在
    if (!fs.existsSync(absolutePath)) {
      throw new Error(`OpenAPI file not found: ${absolutePath}`);
    }

    // 读取文件内容
    const content = fs.readFileSync(absolutePath, 'utf-8');

    // 根据文件扩展名解析
    const ext = path.extname(filePath).toLowerCase();
    let doc: unknown;

    try {
      if (ext === '.yaml' || ext === '.yml') {
        doc = yaml.load(content);
      } else if (ext === '.json') {
        doc = JSON.parse(content);
      } else {
        // 尝试作为 YAML 解析（YAML 是 JSON 的超集）
        try {
          doc = yaml.load(content);
        } catch {
          doc = JSON.parse(content);
        }
      }
    } catch (error) {
      throw new Error(`Failed to parse OpenAPI file: ${error instanceof Error ? error.message : String(error)}`);
    }

    // 基本验证
    if (!doc || typeof doc !== 'object') {
      throw new Error('Invalid OpenAPI document: not an object');
    }

    const docObj = doc as Record<string, unknown>;

    if (!docObj['openapi'] && !docObj['swagger']) {
      throw new Error('Invalid OpenAPI document: missing openapi or swagger version field');
    }

    if (!docObj['paths']) {
      throw new Error('Invalid OpenAPI document: missing paths field');
    }

    // 解析外部引用
    const resolvedDoc = await resolveExternalRefs(doc as OpenApiDocument, path.dirname(absolutePath));

    return resolvedDoc;
  };
};

/**
 * 解析外部引用
 * 简化的实现，实际项目中可能需要更复杂的引用解析逻辑
 */
async function resolveExternalRefs(doc: OpenApiDocument, baseDir: string): Promise<OpenApiDocument> {
  // 这里应该实现引用解析逻辑
  // 暂时返回原始文档
  // TODO: 实现完整的引用解析
  return doc;
}

/**
 * 将 OpenAPI document 转换为 IR
 */
export function documentToIR(document: OpenApiDocument): IR {
  const paths = new Map<string, any>();
  const schemas = new Map<string, any>();
  const operations: any[] = [];

  // 解析 paths
  if (document.paths) {
    for (const [path, pathItem] of Object.entries(document.paths)) {
      paths.set(path, pathItem);

      // 解析 operations
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

  // 解析 schemas
  if (document.components?.schemas) {
    for (const [name, schema] of Object.entries(document.components.schemas)) {
      schemas.set(name, schema);
    }
  }

  return {
    document,
    paths,
    schemas,
    operations,
  };
}
