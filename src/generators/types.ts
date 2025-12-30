/**
 * Generator 类型定义
 * 
 * 导出: ShouldOverwriteFn, GeneratorResult, GeneratorFn
 * 
 * 用于 generator 模块内部的类型定义
 */

import type { Volume } from '../types';
import type { OpenApiDocument, GenerationOptions } from '../types';

export type ShouldOverwriteFn = (path: string) => boolean;

export type GeneratorResult = {
  volume: Volume;
  shouldOverwrite: ShouldOverwriteFn;
};

export type GeneratorFn = (doc: OpenApiDocument, options: GenerationOptions, result: GeneratorResult) => GeneratorResult;

