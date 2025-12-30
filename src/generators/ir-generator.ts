/**
 * generateIr(doc: OpenApiDocument, result: GeneratorResult): GeneratorResult
 * - doc: OpenApiDocument
 * - result: 之前的生成结果
 * - 返回: 修饰后的生成结果
 */

import type { OpenApiDocument, GeneratorResult, ShouldOverwriteFn } from '../types';

export function generateIr(doc: OpenApiDocument, result: GeneratorResult): GeneratorResult {
  const { volume } = result;
  const content = JSON.stringify(doc, null, 2);

  volume.mkdirSync('/', { recursive: true });
  volume.writeFileSync('/ir.json', content);

  const irShouldOverwrite: ShouldOverwriteFn = (path: string) => path === '/ir.json';
  const shouldOverwrite = combineShouldOverwrite(result.shouldOverwrite, irShouldOverwrite);

  return { volume, shouldOverwrite };
}

function combineShouldOverwrite(fn1: ShouldOverwriteFn, fn2: ShouldOverwriteFn): ShouldOverwriteFn {
  return (path: string) => fn1(path) || fn2(path);
}
