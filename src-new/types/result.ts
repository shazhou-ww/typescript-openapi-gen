/**
 * Result 类型定义
 * 
 * 导出: Diagnostic, AnalysisResult, GenerationResult, Volume
 * 
 * 用于描述任务执行结果
 */

import type { Volume } from 'memfs';

export type { Volume };

export type Diagnostic = {
  type: 'error' | 'warning' | 'info';
  message: string;
  location: {
    file: string | null;
    line: number | null;
    column: number | null;
  } | null;
  code: string | null;
};

export type AnalysisResult = {
  success: boolean;
  diagnostics: Diagnostic[];
};

export type GenerationResult = {
  success: boolean;
  diagnostics: Diagnostic[];
  files: string[];
  volume: Volume;
};
