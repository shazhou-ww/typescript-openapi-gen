/**
 * runAnalysis(doc: OpenApiDocument, task: AnalysisTask): Promise<AnalysisResult>
 * - doc: OpenApiDocument
 * - task: 分析任务
 * - 返回: 分析结果
 */

import type { OpenApiDocument, AnalysisTask, AnalysisResult, Diagnostic } from '../types';
import { analyzeStructure } from './structure-analyzer';
import { analyzeRefs } from './refs-analyzer';

type AnalyzerFn = (doc: OpenApiDocument) => Diagnostic[];

const ANALYZERS: Record<string, AnalyzerFn> = {
  'structure': analyzeStructure,
  'refs': analyzeRefs,
};

export async function runAnalysis(
  doc: OpenApiDocument,
  task: AnalysisTask
): Promise<AnalysisResult> {
  const diagnostics: Diagnostic[] = [];

  for (const analyzerName of task.analyzers) {
    const analyzer = ANALYZERS[analyzerName];
    if (!analyzer) {
      diagnostics.push({
        type: 'error',
        message: `Unknown analyzer: ${analyzerName}`,
        location: null,
        code: 'UNKNOWN_ANALYZER',
      });
      continue;
    }

    try {
      const result = analyzer(doc);
      diagnostics.push(...result);
    } catch (error) {
      diagnostics.push({
        type: 'error',
        message: `Analyzer '${analyzerName}' failed: ${error instanceof Error ? error.message : String(error)}`,
        location: null,
        code: 'ANALYZER_ERROR',
      });
    }
  }

  const hasErrors = diagnostics.some(d => d.type === 'error');
  return { success: !hasErrors, diagnostics };
}

