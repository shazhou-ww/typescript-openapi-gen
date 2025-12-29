/**
 * ProgramDeps 类型定义
 * 
 * 导出: ProgramDeps
 */

import type { OpenApiDocument, AnalysisTask, GenerationTask, AnalysisResult, GenerationResult } from '../../types';

export type ProgramDeps = {
  load: (path: string) => Promise<OpenApiDocument>;
  runAnalysis: (doc: OpenApiDocument, task: AnalysisTask) => Promise<AnalysisResult>;
  runGeneration: (doc: OpenApiDocument, task: GenerationTask) => Promise<GenerationResult>;
};

