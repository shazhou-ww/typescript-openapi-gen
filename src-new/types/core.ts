import { OpenApiDocument } from './openapi';

/**
 * Volume 类型，来自 memfs，用于文件系统操作
 */
export type Volume = any; // 暂时使用 any 类型避免复杂的类型定义

/**
 * Diagnostic 类型，用于分析结果
 */
export interface Diagnostic {
  type: 'error' | 'warning' | 'info';
  message: string;
  location?: {
    file?: string;
    line?: number;
    column?: number;
  };
  code?: string;
}

/**
 * Analyzer 函数类型，用于分析 OpenAPI document
 */
export type Analyzer<TDiagnostic extends Diagnostic = Diagnostic> = {
  analyze: (document: OpenApiDocument) => AsyncGenerator<TDiagnostic>;
  report: (diagnostic: TDiagnostic) => void;
};

/**
 * Generator 函数类型，用于生成代码
 */
export type Generator = (document: OpenApiDocument, volume: Volume) => Promise<Volume>;

/**
 * 任务基类
 */
export interface BaseTask {
  openapiPath: string;
  outputDir?: string;
}

/**
 * 分析任务，只读取 OpenAPI document 不生成
 */
export interface AnalysisTask extends BaseTask {
  type: 'analysis';
  analyzers: string[]; // analyzer 名称列表
}

/**
 * 生成任务，读取并生成代码
 */
export interface GenerationTask extends BaseTask {
  type: 'generation';
  generators: string[]; // generator 名称列表
  format?: boolean; // 是否格式化
}

/**
 * 任务类型
 */
export type Task = AnalysisTask | GenerationTask;

/**
 * Command 解析器回调函数类型
 */
export type CommandHandler = (task: Task) => Promise<void>;

/**
 * 任务执行结果
 */
export interface TaskResult {
  success: boolean;
  diagnostics: Diagnostic[];
  output?: {
    files: string[];
    volume: Volume;
  };
}
