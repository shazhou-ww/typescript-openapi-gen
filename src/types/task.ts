/**
 * Task 类型定义
 * 
 * 导出: Task, AnalysisTask, GenerationTask
 * 
 * Task: 描述要执行的任务
 */

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

