/**
 * createProgram(deps: ProgramDeps): Command
 * - deps: 依赖（load, runAnalysis, runGeneration）
 * - 返回: 配置好的 Commander 程序实例
 */

import { Command } from 'commander';
import type { ProgramDeps } from './deps';
import { registerIrCommand } from './ir-command';
import { registerGenCommands } from './gen-command';

export function createProgram(deps: ProgramDeps): Command {
  const program = new Command();

  program
    .name('tsoapi')
    .description('Generate TypeScript controllers and routes from OpenAPI specifications')
    .version('0.2.3');

  registerIrCommand(program, deps);
  registerGenCommands(program, deps);

  return program;
}

