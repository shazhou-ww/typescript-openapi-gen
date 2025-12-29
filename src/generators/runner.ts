/**
 * runGeneration(doc: OpenApiDocument, task: GenerationTask): Promise<GenerationResult>
 * - doc: OpenApiDocument
 * - task: 生成任务
 * - 返回: 生成结果
 */

import { Volume } from 'memfs';
import type { OpenApiDocument, GenerationTask, GenerationResult, Diagnostic, Volume as VolumeType } from '../types';
import { generateController } from './controller-generator';
import { generateOpenApi } from './openapi-generator';
import { generateIr } from './ir-generator';
import { generateExpressRouter } from './express-router-generator';
import { generateElysiaRouter } from './elysia-router-generator';
import { generateFastifyRouter } from './fastify-router-generator';
import { generateHonoRouter } from './hono-router-generator';
import { writeVolumeToDisk } from './file-writer';

type GeneratorFn = (doc: OpenApiDocument, volume: VolumeType) => VolumeType;

const GENERATORS: Record<string, GeneratorFn> = {
  'controller': generateController,
  'openapi': generateOpenApi,
  'ir': generateIr,
  'express-router': generateExpressRouter,
  'elysia-router': generateElysiaRouter,
  'fastify-router': generateFastifyRouter,
  'hono-router': generateHonoRouter,
};

type GenerationState = { volume: VolumeType; diagnostics: Diagnostic[] };

export async function runGeneration(
  doc: OpenApiDocument,
  task: GenerationTask
): Promise<GenerationResult> {
  const initial: GenerationState = { volume: new Volume(), diagnostics: [] };

  const { volume, diagnostics } = task.generators.reduce(
    (state, name) => applyGenerator(doc, state, name),
    initial
  );

  if (task.outputDir) {
    await writeVolumeToDisk(volume, task.outputDir).catch(error => {
      diagnostics.push(createDiagnostic('WRITE_ERROR', `Failed to write files: ${formatError(error)}`));
    });
  }

  const files = getVolumeFiles(volume);
  const hasErrors = diagnostics.some(d => d.type === 'error');

  return { success: !hasErrors, diagnostics, files, volume };
}

function applyGenerator(doc: OpenApiDocument, state: GenerationState, name: string): GenerationState {
  const generator = GENERATORS[name];
  if (!generator) {
    return {
      ...state,
      diagnostics: [...state.diagnostics, createDiagnostic('UNKNOWN_GENERATOR', `Unknown generator: ${name}`)],
    };
  }

  try {
    return { ...state, volume: generator(doc, state.volume) };
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
