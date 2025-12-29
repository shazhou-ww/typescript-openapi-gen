import { Command } from 'commander';
import { registerIrCommand } from '../ir';
import { registerGenCommands } from '../gen';

/**
 * 创建并配置 Commander 程序
 */
export function createProgram(handler: (task: any) => Promise<void>): Command {
  const program = new Command();

  program
    .name('tsoapi')
    .description('Generate TypeScript controllers and routes from OpenAPI specifications')
    .version('0.2.3');

  // 注册 IR 命令
  registerIrCommand(program, handler);

  // 注册生成命令
  registerGenCommands(program, handler);

  return program;
}
