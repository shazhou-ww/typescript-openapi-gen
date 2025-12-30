/**
 * runGeneration(doc: OpenApiDocument, task: GenerationTask): Promise<GenerationResult>
 * - doc: OpenApiDocument
 * - task: 生成任务
 * - 返回: 生成结果
 */

import { Volume } from 'memfs';
import type { OpenApiDocument, GenerationTask, GenerationResult, Diagnostic, Volume as VolumeType, GenerationOptions } from '../types';
import type { GeneratorFn, GeneratorResult } from './types';
import { generateController } from './controller-generator';
import { generateOpenApi } from './openapi-generator';
import { generateIr } from './ir-generator';
import { generateExpressRouter } from './router-generators/express';
import { generateElysiaRouter } from './router-generators/elysia';
import { generateFastifyRouter } from './router-generators/fastify';
import { generateHonoRouter } from './router-generators/hono';
import { writeVolumeToDisk } from './file-writer';

const GENERATORS: Record<string, GeneratorFn> = {
  'controller': generateController,
  'openapi': generateOpenApi,
  'ir': generateIr,
  'express-router': generateExpressRouter,
  'elysia-router': generateElysiaRouter,
  'fastify-router': generateFastifyRouter,
  'hono-router': generateHonoRouter,
};

type GenerationState = { result: GeneratorResult; diagnostics: Diagnostic[] };

export async function runGeneration(
  doc: OpenApiDocument,
  task: GenerationTask
): Promise<GenerationResult> {
  const initialResult: GeneratorResult = {
    volume: new Volume(),
    shouldOverwrite: () => false
  };

  const initial: GenerationState = { 
    result: initialResult,
    diagnostics: []
  };

  const generatorsToRun = determineGenerators(task.options);
  const { result, diagnostics } = generatorsToRun.reduce(
    (state: GenerationState, name: string) => applyGenerator(doc, task.options, state, name),
    initial
  );

  await writeVolumeToDisk(result.volume, task.outputDir, result.shouldOverwrite).catch(error => {
    diagnostics.push(createDiagnostic('WRITE_ERROR', `Failed to write files: ${formatError(error)}`));
  });

  const files = getVolumeFiles(result.volume);
  const hasErrors = diagnostics.some((d: Diagnostic) => d.type === 'error');

  return { success: !hasErrors, diagnostics, files, volume: result.volume };
}

function determineGenerators(options: GenerationOptions): string[] {
  const generators: string[] = [];

  if (options.controller && options.controller.path) {
    generators.push('controller');
  }

  if (options.routers.elysia && options.routers.elysia.path) {
    generators.push('elysia-router');
  }

  if (options.routers.express && options.routers.express.path) {
    generators.push('express-router');
  }

  if (options.routers.fastify && options.routers.fastify.path) {
    generators.push('fastify-router');
  }

  if (options.routers.hono && options.routers.hono.path) {
    generators.push('hono-router');
  }

  if (options.openApi && (options.openApi.inController || options.openApi.allInOnePath)) {
    generators.push('openapi');
  }

  return generators;
}

function applyGenerator(doc: OpenApiDocument, options: GenerationOptions, state: GenerationState, name: string): GenerationState {
  const generator = GENERATORS[name];
  if (!generator) {
    return {
      ...state,
      diagnostics: [...state.diagnostics, createDiagnostic('UNKNOWN_GENERATOR', `Unknown generator: ${name}`)],
    };
  }

  try {
    const newResult = generator(doc, options, state.result);
    return { 
      ...state, 
      result: newResult
    };
  } catch (error) {
    return {
      ...state,
      diagnostics: [...state.diagnostics, createDiagnostic('GENERATOR_ERROR', `Generator '${name}' failed: ${formatError(error)}`)],
    };
  }
}

function createDiagnostic(code: string, message: string): Diagnostic {
  return { type: 'error', message, location: null, code };
}

function formatError(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function getVolumeFiles(volume: VolumeType): string[] {
  const files: string[] = [];

  const traverse = (dir: string) => {
    try {
      const items = volume.readdirSync(dir) as string[];
      for (const item of items) {
        const fullPath = dir === '/' ? `/${item}` : `${dir}/${item}`;
        const stat = volume.statSync(fullPath);
        if (stat.isFile()) {
          files.push(fullPath);
        } else if (stat.isDirectory()) {
          traverse(fullPath);
        }
      }
    } catch {
      // 忽略错误
    }
  };

  traverse('/');
  return files;
}
