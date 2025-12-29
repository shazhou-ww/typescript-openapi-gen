/**
 * runGeneration(doc: OpenApiDocument, task: GenerationTask): Promise<GenerationResult>
 * - doc: OpenApiDocument
 * - task: 生成任务
 * - 返回: 生成结果
 */

import { Volume } from 'memfs';
import type { OpenApiDocument, GenerationTask, GenerationResult, Diagnostic, Volume as VolumeType } from '../../types';
import { generateController } from './controller-generator';
import { generateOpenApi } from './openapi-generator';
import { generateIr } from './ir-generator';
import { writeVolumeToDisk } from './file-writer';

type GeneratorFn = (doc: OpenApiDocument, volume: VolumeType) => VolumeType;

const GENERATORS: Record<string, GeneratorFn> = {
  'controller': generateController,
  'openapi': generateOpenApi,
  'ir': generateIr,
};

export async function runGeneration(
  doc: OpenApiDocument,
  task: GenerationTask
): Promise<GenerationResult> {
  const diagnostics: Diagnostic[] = [];
  let volume = new Volume() as unknown as VolumeType;

  for (const generatorName of task.generators) {
    const generator = GENERATORS[generatorName];
    if (!generator) {
      diagnostics.push({
        type: 'error',
        message: `Unknown generator: ${generatorName}`,
        location: null,
        code: 'UNKNOWN_GENERATOR',
      });
      continue;
    }

    try {
      volume = generator(doc, volume);
    } catch (error) {
      diagnostics.push({
        type: 'error',
        message: `Generator '${generatorName}' failed: ${error instanceof Error ? error.message : String(error)}`,
        location: null,
        code: 'GENERATOR_ERROR',
      });
    }
  }

  // 如果指定了输出目录，写入磁盘
  if (task.outputDir) {
    try {
      await writeVolumeToDisk(volume, task.outputDir);
    } catch (error) {
      diagnostics.push({
        type: 'error',
        message: `Failed to write files: ${error instanceof Error ? error.message : String(error)}`,
        location: null,
        code: 'WRITE_ERROR',
      });
    }
  }

  const files = getVolumeFiles(volume);
  const hasErrors = diagnostics.some(d => d.type === 'error');

  return { success: !hasErrors, diagnostics, files, volume };
}

function getVolumeFiles(volume: VolumeType): string[] {
  const files: string[] = [];

  const traverse = (dir: string) => {
    try {
      const items = volume.readdirSync(dir);
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

