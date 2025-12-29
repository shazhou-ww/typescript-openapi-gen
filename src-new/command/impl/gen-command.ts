/**
 * registerGenCommands(program: Command, deps: ProgramDeps): void
 * - program: Commander 程序实例
 * - deps: 依赖
 */

import { Command } from 'commander';
import * as fs from 'node:fs';
import * as path from 'node:path';
import type { ProgramDeps } from './deps';
import type { GenerationTask } from '../../types';

const GENERATOR_MAP: Record<string, string[]> = {
  controller: ['controller'],
  openapi: ['openapi'],
  ir: ['ir'],
};

export function registerGenCommands(program: Command, deps: ProgramDeps): void {
  const genCmd = program.command('gen').description('Generate code from OpenAPI specs');

  registerControllerCommand(genCmd, deps);
  registerOpenapiCommand(genCmd, deps);
  registerIrGenCommand(genCmd, deps);
}

function registerControllerCommand(genCmd: Command, deps: ProgramDeps): void {
  genCmd
    .command('controller')
    .description('Generate controller skeleton code')
    .argument('<file>', 'OpenAPI specification file')
    .requiredOption('-o, --output-dir <path>', 'Output directory')
    .action(async (file: string, options: { outputDir: string }) => {
      await executeGeneration(file, options.outputDir, GENERATOR_MAP.controller, deps);
    });
}

function registerOpenapiCommand(genCmd: Command, deps: ProgramDeps): void {
  genCmd
    .command('openapi')
    .description('Generate OpenAPI specification')
    .argument('<file>', 'OpenAPI specification file')
    .requiredOption('-o, --output-dir <path>', 'Output directory')
    .action(async (file: string, options: { outputDir: string }) => {
      await executeGeneration(file, options.outputDir, GENERATOR_MAP.openapi, deps);
    });
}

function registerIrGenCommand(genCmd: Command, deps: ProgramDeps): void {
  genCmd
    .command('ir')
    .description('Generate IR JSON file')
    .argument('<file>', 'OpenAPI specification file')
    .requiredOption('-o, --output-dir <path>', 'Output directory')
    .action(async (file: string, options: { outputDir: string }) => {
      await executeGeneration(file, options.outputDir, GENERATOR_MAP.ir, deps);
    });
}

async function executeGeneration(
  file: string,
  outputDir: string,
  generators: string[],
  deps: ProgramDeps
): Promise<void> {
  const inputFile = path.resolve(file);
  const resolvedOutputDir = path.resolve(outputDir);

  if (!fs.existsSync(inputFile)) {
    console.error(`Input file not found: ${inputFile}`);
    process.exit(1);
  }

  try {
    const doc = await deps.load(inputFile);

    const task: GenerationTask = {
      type: 'generation',
      generators,
      outputDir: resolvedOutputDir,
      format: false,
    };

    const result = await deps.runGeneration(doc, task);
    printDiagnostics(result.diagnostics);

    if (result.success) {
      console.log(`✅ Generated ${result.files.length} files to ${resolvedOutputDir}`);
    } else {
      process.exit(1);
    }
  } catch (error) {
    console.error(`Failed: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}

function printDiagnostics(diagnostics: Array<{ type: string; message: string }>): void {
  for (const d of diagnostics) {
    const prefix = d.type === 'error' ? '❌' : d.type === 'warning' ? '⚠️' : 'ℹ️';
    console.log(`${prefix} ${d.message}`);
  }
}

