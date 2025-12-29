import { Command } from 'commander';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { GenerationTask, CommandHandler } from '../types';

/**
 * 生成器映射
 */
const GENERATOR_MAP = {
  controller: ['controller'],
  openapi: ['openapi'],
  elysia: ['controller', 'elysia-router'],
  express: ['controller', 'express-router'],
  fastify: ['controller', 'fastify-router'],
  hono: ['controller', 'hono-router'],
} as const;

/**
 * 注册生成命令
 */
export function registerGenCommands(program: Command, handler: CommandHandler): void {
  const genCmd = program.command('gen').description('Generate code from OpenAPI specs');

  // Controller 命令
  genCmd
    .command('controller')
    .description('Generate controller skeleton code from OpenAPI specification')
    .argument('<file>', 'OpenAPI specification file (YAML or JSON)')
    .requiredOption('-o, --output-dir <path>', 'Output directory for generated files')
    .option('--controller-folder <name>', 'Subfolder name for controllers (default: controller)')
    .option('--shared-types-folder <name>', 'Subfolder name for shared types (default: shared-types)')
    .option('--prettier <path>', 'Path to prettier config file for formatting output')
    .action(async (file: string, options: {
      outputDir: string;
      controllerFolder?: string;
      sharedTypesFolder?: string;
      prettier?: string;
    }) => {
      await executeGenerationTask(file, options, [...GENERATOR_MAP.controller], handler);
    });

  // OpenAPI 命令
  genCmd
    .command('openapi')
    .description('Generate OpenAPI specification from another OpenAPI specification')
    .argument('<file>', 'OpenAPI specification file (YAML or JSON)')
    .requiredOption('-o, --output-dir <path>', 'Output directory for generated files')
    .option('--prettier <path>', 'Path to prettier config file for formatting output')
    .action(async (file: string, options: {
      outputDir: string;
      prettier?: string;
    }) => {
      await executeGenerationTask(file, options, ['openapi'], handler);
    });

  // Framework 特定命令
  const frameworks = ['elysia', 'express', 'fastify', 'hono'] as const;

  for (const framework of frameworks) {
    genCmd
      .command(framework)
      .description(`Generate ${framework} code from OpenAPI specification`)
      .argument('<file>', 'OpenAPI specification file (YAML or JSON)')
      .requiredOption('-o, --output-dir <path>', 'Output directory for generated files')
      .option('--controller-folder <name>', 'Subfolder name for controllers (default: controller)')
      .option('--shared-types-folder <name>', 'Subfolder name for shared types (default: shared-types)')
      .option('--prettier <path>', 'Path to prettier config file for formatting output')
      .action(async (file: string, options: {
        outputDir: string;
        controllerFolder?: string;
        sharedTypesFolder?: string;
        prettier?: string;
      }) => {
        const generators = [...GENERATOR_MAP[framework]];
        await executeGenerationTask(file, options, generators, handler);
      });
  }

  // Router 子命令组
  const routerCmd = genCmd.command('router').description('Generate router for a specific framework');

  for (const framework of frameworks) {
    routerCmd
      .command(framework)
      .description(`Generate ${framework} router code from OpenAPI specification`)
      .argument('<file>', 'OpenAPI specification file (YAML or JSON)')
      .requiredOption('-o, --output-dir <path>', 'Output directory for generated files')
      .option('--prettier <path>', 'Path to prettier config file for formatting output')
      .action(async (file: string, options: {
        outputDir: string;
        prettier?: string;
      }) => {
        const generators = [`${framework}-router`];
        await executeGenerationTask(file, options, [...generators], handler);
      });
  }
}

/**
 * 执行生成任务的辅助函数
 */
async function executeGenerationTask(
  file: string,
  options: {
    outputDir: string;
    controllerFolder?: string;
    sharedTypesFolder?: string;
    prettier?: string;
  },
  generators: string[],
  handler: CommandHandler
): Promise<void> {
  const inputFile = path.resolve(file);
  const outputDir = path.resolve(options.outputDir);
  const prettierConfig = options.prettier ? path.resolve(options.prettier) : undefined;

  // 检查输入文件是否存在
  if (!fs.existsSync(inputFile)) {
    console.error(`Input file not found: ${inputFile}`);
    process.exit(1);
  }

  // 检查 prettier 配置是否存在（如果提供）
  if (prettierConfig && !fs.existsSync(prettierConfig)) {
    console.error(`Prettier config file not found: ${prettierConfig}`);
    process.exit(1);
  }

  // 创建生成任务
  const task: GenerationTask = {
    type: 'generation',
    openapiPath: inputFile,
    outputDir,
    generators,
    format: !!prettierConfig,
  };

  try {
    await handler(task);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Failed to generate code: ${error.message}`);
    } else {
      console.error(`Failed to generate code: ${String(error)}`);
    }
    process.exit(1);
  }
}
