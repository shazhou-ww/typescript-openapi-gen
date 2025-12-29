import { Command } from 'commander';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { AnalysisTask, CommandHandler } from '../types';

/**
 * 注册 IR 命令
 */
export function registerIrCommand(program: Command, handler: CommandHandler): void {
  program
    .command('ir')
    .description('Analyze and display OpenAPI specification as intermediate representation')
    .argument('<file>', 'OpenAPI specification file (YAML or JSON)')
    .option('--validate', 'Validate the OpenAPI specification', false)
    .action(async (file: string, options: { validate?: boolean }) => {
      const inputFile = path.resolve(file);

      // 检查输入文件是否存在
      if (!fs.existsSync(inputFile)) {
        console.error(`Input file not found: ${inputFile}`);
        process.exit(1);
      }

      // 创建分析任务
      const task: AnalysisTask = {
        type: 'analysis',
        openapiPath: inputFile,
        analyzers: options.validate ? ['validator'] : [],
      };

      try {
        await handler(task);
      } catch (error) {
        if (error instanceof Error) {
          console.error(`Failed to analyze OpenAPI file: ${error.message}`);
        } else {
          console.error(`Failed to analyze OpenAPI file: ${String(error)}`);
        }
        process.exit(1);
      }
    });
}
