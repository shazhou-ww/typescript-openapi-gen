/**
 * registerGenCommands(program: Command, deps: ProgramDeps): void
 * - program: Commander 程序实例
 * - deps: 依赖
 */

import { Command } from 'commander';
import * as fs from 'node:fs';
import * as path from 'node:path';
import type { ProgramDeps } from './deps';
import type { GenerationTask, GenerationOptions, RouterType, OpenApiDocument, GenerationResult } from '../types';

type GenCommandOptions = {
  output: string;
  elysia?: string | boolean;
  express?: string | boolean;
  fastify?: string | boolean;
  hono?: string | boolean;
  openapi?: boolean;
  openapiAllinone?: string | boolean;
  controllerDirname?: string;
  sharedTypesDirname?: string;
};

const DEFAULT_ROUTER_PATHS: Record<RouterType, string> = {
  elysia: 'elysia-router.ts',
  express: 'express-router.ts',
  fastify: 'fastify-router.ts',
  hono: 'hono-router.ts',
};

const DEFAULT_CONTROLLER_DIRNAME = 'controller';
const DEFAULT_SHARED_TYPES_DIRNAME = 'shared-types';
const DEFAULT_OPENAPI_ALLINONE_PATH = 'openapi';

export function registerGenCommands(program: Command, deps: ProgramDeps): void {
  program
    .command('gen')
    .description('Generate code from OpenAPI specs')
    .argument('<file>', 'OpenAPI specification file')
    .requiredOption('-o, --output <path>', 'Output directory')
    .option('--elysia [path]', 'Generate Elysia router')
    .option('--express [path]', 'Generate Express router')
    .option('--fastify [path]', 'Generate Fastify router')
    .option('--hono [path]', 'Generate Hono router')
    .option('--openapi', 'Generate OpenAPI documents in controller folders')
    .option('--openapi-allinone [path]', 'Generate all-in-one OpenAPI document')
    .option('--controller-dirname <name>', 'Controller directory name', DEFAULT_CONTROLLER_DIRNAME)
    .option('--shared-types-dirname <name>', 'Shared types directory name', DEFAULT_SHARED_TYPES_DIRNAME)
    .action(async (file: string, options: GenCommandOptions) => {
      await executeGeneration(file, options, deps);
    });
}

async function executeGeneration(
  file: string,
  options: GenCommandOptions,
  deps: ProgramDeps
): Promise<void> {
  const inputFile = path.resolve(file);
  const resolvedOutputDir = path.resolve(options.output);
  validateInputFile(inputFile);

  try {
    const doc = await deps.load(inputFile);
    const result = await runGenerationTask(doc, resolvedOutputDir, options, deps);
    printDiagnostics(result.diagnostics);
    handleGenerationResult(result, resolvedOutputDir);
  } catch (error) {
    handleGenerationError(error);
  }
}

function validateInputFile(inputFile: string): void {
  if (!fs.existsSync(inputFile)) {
    console.error(`Input file not found: ${inputFile}`);
    process.exit(1);
  }
}

async function runGenerationTask(
  doc: OpenApiDocument,
  outputDir: string,
  options: GenCommandOptions,
  deps: ProgramDeps
): Promise<GenerationResult> {
  const generationOptions = buildGenerationOptions(options);
  const task: GenerationTask = {
    type: 'generation',
    outputDir,
    options: generationOptions,
  };
  return await deps.runGeneration(doc, task);
}

function handleGenerationResult(
  result: GenerationResult,
  outputDir: string
): void {
  if (result.success) {
    console.log(`✅ Generated ${result.files.length} files to ${outputDir}`);
  } else {
    process.exit(1);
  }
}

function handleGenerationError(error: unknown): void {
  console.error(`Failed: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}

function buildGenerationOptions(options: GenCommandOptions): GenerationOptions {
  const routerPaths = buildRouterPaths(options);
  const controllerPath = options.controllerDirname || DEFAULT_CONTROLLER_DIRNAME;
  const sharedTypesPath = options.sharedTypesDirname || DEFAULT_SHARED_TYPES_DIRNAME;
  const openapiAllinonePath = getOpenapiAllinonePath(options);

  return {
    controller: { path: controllerPath },
    sharedTypes: { path: sharedTypesPath },
    routers: routerPaths,
    prettier: { enabled: false, path: '' },
    openApi: {
      allInOnePath: openapiAllinonePath,
      inController: options.openapi === true,
      format: 'yaml',
    },
  };
}

function buildRouterPaths(options: GenCommandOptions): Record<RouterType, { path: string }> {
  return {
    elysia: { path: getRouterPath('elysia', options.elysia) },
    express: { path: getRouterPath('express', options.express) },
    fastify: { path: getRouterPath('fastify', options.fastify) },
    hono: { path: getRouterPath('hono', options.hono) },
  };
}

function getRouterPath(routerType: RouterType, optionValue: string | boolean | undefined): string {
  if (optionValue === undefined || optionValue === false) {
    return '';
  }
  if (optionValue === true) {
    return DEFAULT_ROUTER_PATHS[routerType];
  }
  return optionValue;
}

function getOpenapiAllinonePath(options: GenCommandOptions): string | null {
  if (options.openapiAllinone === undefined || options.openapiAllinone === false) {
    return null;
  }
  if (options.openapiAllinone === true) {
    return DEFAULT_OPENAPI_ALLINONE_PATH;
  }
  return options.openapiAllinone;
}

function printDiagnostics(diagnostics: Array<{ type: string; message: string }>): void {
  for (const d of diagnostics) {
    const prefix = d.type === 'error' ? '❌' : d.type === 'warning' ? '⚠️' : 'ℹ️';
    console.log(`${prefix} ${d.message}`);
  }
}

