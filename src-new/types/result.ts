/**
 * Result 类型定义
 * 
 * 导出: Diagnostic, AnalysisResult, GenerationResult, Volume
 * 
 * 用于描述任务执行结果
 */

/** Volume 类型，来自 memfs，用于内存文件系统操作 */
export type Volume = {
  writeFileSync: (path: string, content: string) => void;
  readFileSync: (path: string, encoding: string) => string;
  mkdirSync: (path: string, options?: { recursive?: boolean }) => void;
  existsSync: (path: string) => boolean;
  readdirSync: (path: string) => string[];
  statSync: (path: string) => { isFile: () => boolean; isDirectory: () => boolean };
};

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

