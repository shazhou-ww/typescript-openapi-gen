#!/usr/bin/env bun

/**
 * CLI 入口文件
 * 组装依赖并启动程序
 */

import { load } from './loader';
import { runAnalysis } from './analyzers';
import { runGeneration } from './generators';
import { createProgram } from './command';

const program = createProgram({
  load,
  runAnalysis,
  runGeneration,
});

program.parse(process.argv);
