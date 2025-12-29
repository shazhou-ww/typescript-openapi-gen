// 导出类型
export type { Task, AnalysisTask, GenerationTask, CommandHandler } from '../types';

// 导出程序创建函数
export { createProgram } from './program';

// 导出命令注册函数
export { registerIrCommand } from './ir';
export { registerGenCommands } from './gen';
