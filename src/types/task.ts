/**
 * Task 类型定义
 * 
 * 导出: Task, AnalysisTask, GenerationTask, ShouldOverwriteFn, GeneratorResult
 * 
 * Task: 描述要执行的任务
 */

import type { Volume } from './result';

export type AnalysisTask = {
  type: 'analysis';
  analyzers: string[];
};

export type GenerationTask = {
  type: 'generation';
  generators: string[];
  outputDir: string | null;
  format: boolean;
};

export type Task = AnalysisTask | GenerationTask;

export type ShouldOverwriteFn = (path: string) => boolean;

export type GeneratorResult = {
  volume: Volume;
  shouldOverwrite: ShouldOverwriteFn;
};

