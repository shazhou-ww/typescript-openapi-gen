#!/usr/bin/env bun

import { createProgram, CommandHandler } from './command';
import { runTask, RunnerConfig } from './runner';
import { createOpenApiLoader } from './loader';
import { createDefaultAnalyzerRegistry } from './analyzers';
import { createDefaultGeneratorRegistry } from './generators';
import { Task, TaskResult } from './types';

/**
 * 创建默认的 runner 配置
 */
function createDefaultRunnerConfig(): RunnerConfig {
  return {
    loader: createOpenApiLoader(),
    analyzerRegistry: createDefaultAnalyzerRegistry(),
    generatorRegistry: createDefaultGeneratorRegistry(),
  };
}

/**
 * 命令处理器
 */
const commandHandler: CommandHandler = async (task: Task): Promise<void> => {
  // 创建配置并运行任务
  const config = createDefaultRunnerConfig();
  const result: TaskResult = await runTask(config, task);

  // 处理结果
  if (!result.success) {
    console.error('❌ Task failed');
    process.exit(1);
  }

  if (task.type === 'analysis') {
    console.log('✅ Analysis completed');
  } else {
    console.log('✅ Generation completed');
    if (result.output) {
      console.log(`   Files generated: ${result.output.files.length}`);
      if (task.outputDir) {
        console.log(`   Output directory: ${task.outputDir}`);
      }
    }
  }

  // 显示诊断信息
  if (result.diagnostics.length > 0) {
    const errors = result.diagnostics.filter(d => d.type === 'error');
    const warnings = result.diagnostics.filter(d => d.type === 'warning');

    if (errors.length > 0) {
      console.warn(`\n❌ Errors: ${errors.length}`);
    }

    if (warnings.length > 0) {
      console.warn(`\n⚠️ Warnings: ${warnings.length}`);
    }
  }
};

// 创建并运行程序
const program = createProgram(commandHandler);
program.parse();
