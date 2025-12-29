/**
 * createProgram(deps: ProgramDeps): Command
 * - deps: 依赖（load, runAnalysis, runGeneration）
 * - 返回: 配置好的 Commander 程序实例
 */

export { createProgram } from './impl/program';
export type { ProgramDeps } from './impl/deps';
