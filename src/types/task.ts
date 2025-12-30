/**
 * Task 类型定义
 * 
 * 导出: Task, AnalysisTask, GenerationTask, GenerationOptions, RouterType, RouterOptions, ControllerOptions, SharedTypeOptions, PrettierOptions
 * 
 * Task: 描述要执行的任务
 */

type AnalyzerType = 'structure' | 'refs';

export type AnalysisTask = {
  type: 'analysis';
  analyzers: AnalyzerType[];
};

export type RouterType = 'express' | 'fastify' | 'hono' | 'elysia';

export type RouterOptions = {
  path: string; // Relative path to the output directory
};

export type ControllerOptions = {
  path: string; // Relative path to the output directory
};

export type SharedTypeOptions = {
  path: string; // Relative path to the output directory
};

export type PrettierOptions = {
  path: string; // Path to the prettier config file
};

export type GenerationOptions = {
  routers: Record<RouterType, RouterOptions>;
  controller: ControllerOptions;
  sharedTypes: SharedTypeOptions;
  prettier: PrettierOptions;
};

export type GenerationTask = {
  type: 'generation';
  outputDir: string;
  options: GenerationOptions;
};

export type Task = AnalysisTask | GenerationTask;

