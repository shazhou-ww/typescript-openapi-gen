import { Volume, createFsFromVolume } from 'memfs';
import { Task, TaskResult, AnalysisTask, GenerationTask, Diagnostic } from '../types';
import { Loader } from '../loader';
import { AnalyzerRegistry, getAnalyzer } from '../analyzers';
import { GeneratorRegistry, getGenerator } from '../generators';

/**
 * Runner 配置
 */
export interface RunnerConfig {
  loader: Loader;
  analyzerRegistry: AnalyzerRegistry;
  generatorRegistry: GeneratorRegistry;
}

/**
 * 执行任务
 */
export async function runTask(config: RunnerConfig, task: Task): Promise<TaskResult> {
  try {
    // 加载 OpenAPI document
    const document = await config.loader(task.openapiPath);

    // 创建内存文件系统
    const volume = new Volume() as any;

    const diagnostics: Diagnostic[] = [];

    if (task.type === 'analysis') {
      // 执行分析任务
      const analysisDiagnostics = await runAnalyzers(config, task, document);
      diagnostics.push(...analysisDiagnostics);
    } else {
      // 执行生成任务
      const result = await runGenerators(config, task, document, volume);
      diagnostics.push(...result.diagnostics);

      // 如果指定了输出目录，将内存文件系统写入磁盘
      if (task.outputDir) {
        await writeVolumeToDisk(volume, task.outputDir);
      }

      return {
        success: diagnostics.filter(d => d.type === 'error').length === 0,
        diagnostics,
        output: {
          files: getVolumeFiles(volume),
          volume,
        },
      };
    }

    return {
      success: diagnostics.filter(d => d.type === 'error').length === 0,
      diagnostics,
    };
  } catch (error) {
    const diagnostic: Diagnostic = {
      type: 'error',
      message: error instanceof Error ? error.message : String(error),
    };

    return {
      success: false,
      diagnostics: [diagnostic],
    };
  }
}

/**
 * 执行分析器
 */
async function runAnalyzers(
  config: RunnerConfig,
  task: AnalysisTask,
  document: any
): Promise<Diagnostic[]> {
  const diagnostics: Diagnostic[] = [];

  for (const analyzerName of task.analyzers) {
    const analyzer = getAnalyzer(config.analyzerRegistry, analyzerName);
    if (!analyzer) {
      diagnostics.push({
        type: 'error',
        message: `Analyzer not found: ${analyzerName}`,
      });
      continue;
    }

    try {
      for await (const diagnostic of analyzer.analyze(document)) {
        analyzer.report(diagnostic);
        diagnostics.push(diagnostic);
      }
    } catch (error) {
      diagnostics.push({
        type: 'error',
        message: `Analyzer '${analyzerName}' failed: ${error instanceof Error ? error.message : String(error)}`,
      });
    }
  }

  return diagnostics;
}

/**
 * 执行生成器
 */
async function runGenerators(
  config: RunnerConfig,
  task: GenerationTask,
  document: any,
  volume: Volume
): Promise<{ diagnostics: Diagnostic[]; volume: Volume }> {
  const diagnostics: Diagnostic[] = [];
  let currentVolume = volume;

  for (const generatorName of task.generators) {
    const generator = getGenerator(config.generatorRegistry, generatorName);
    if (!generator) {
      diagnostics.push({
        type: 'error',
        message: `Generator not found: ${generatorName}`,
      });
      continue;
    }

    try {
      currentVolume = await generator(document, currentVolume);
    } catch (error) {
      diagnostics.push({
        type: 'error',
        message: `Generator '${generatorName}' failed: ${error instanceof Error ? error.message : String(error)}`,
      });
    }
  }

  return { diagnostics, volume: currentVolume };
}

/**
 * 将内存文件系统写入磁盘
 */
async function writeVolumeToDisk(volume: Volume, outputDir: string): Promise<void> {
  const fs = createFsFromVolume(volume);
  const { promises: fsp } = await import('node:fs');
  const path = await import('node:path');

  // 递归创建目录并写入文件
  const writeFileRecursive = async (filePath: string): Promise<void> => {
    const fullPath = path.join(outputDir, filePath);
    const dir = path.dirname(fullPath);

    try {
      await fsp.mkdir(dir, { recursive: true });
      const content = fs.readFileSync(filePath, 'utf-8');
      await fsp.writeFile(fullPath, content);
    } catch (error) {
      console.warn(`Failed to write file ${fullPath}: ${error}`);
    }
  };

  const files = getVolumeFiles(volume);
  await Promise.all(files.map(writeFileRecursive));
}

/**
 * 获取内存文件系统中的所有文件
 */
function getVolumeFiles(volume: Volume): string[] {
  const files: string[] = [];

  const traverse = (currentPath: string) => {
    try {
      const stat = volume.statSync(currentPath);
      if (stat.isFile()) {
        files.push(currentPath);
      } else if (stat.isDirectory()) {
        const items = volume.readdirSync(currentPath) as string[];
        for (const item of items) {
          traverse(`${currentPath}/${item}`);
        }
      }
    } catch {
      // 忽略不存在的路径
    }
  };

  traverse('.');
  return files;
}
