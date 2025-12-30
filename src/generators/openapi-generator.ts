/**
 * generateOpenApi(doc: OpenApiDocument, result: GeneratorResult): GeneratorResult
 * - doc: OpenApiDocument
 * - result: 之前的生成结果
 * - 返回: 修饰后的生成结果
 */

import type { OpenApiDocument, GeneratorResult, ShouldOverwriteFn } from '../types';
import * as yaml from 'js-yaml';

export function generateOpenApi(doc: OpenApiDocument, result: GeneratorResult): GeneratorResult {
  const { volume } = result;
  const openApiDoc = toOpenApiFormat(doc);
  const content = yaml.dump(openApiDoc, { indent: 2, lineWidth: -1 });

  volume.mkdirSync('/', { recursive: true });
  volume.writeFileSync('/openapi.yaml', content);

  const openapiShouldOverwrite: ShouldOverwriteFn = (path: string) => path === '/openapi.yaml';
  const shouldOverwrite = combineShouldOverwrite(result.shouldOverwrite, openapiShouldOverwrite);

  return { volume, shouldOverwrite };
}

function combineShouldOverwrite(fn1: ShouldOverwriteFn, fn2: ShouldOverwriteFn): ShouldOverwriteFn {
  return (path: string) => fn1(path) || fn2(path);
}

function toOpenApiFormat(doc: OpenApiDocument): Record<string, unknown> {
  // TODO: 实现完整的转换逻辑
  return {
    openapi: '3.0.0',
    info: { title: 'Generated API', version: '1.0.0' },
    paths: doc.paths,
    components: { schemas: doc.types },
  };
}
