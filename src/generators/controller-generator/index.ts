/**
 * generateController(doc: OpenApiDocument, options: GenerationOptions, result: GeneratorResult): GeneratorResult
 * - doc: OpenApiDocument
 * - options: 生成选项
 * - result: 之前的生成结果
 * - 返回: 修饰后的生成结果
 */

import type { OpenApiDocument, Volume, GenerationOptions } from '../../types';
import type { GeneratorResult, ShouldOverwriteFn } from '../types';
import { buildRouteTree } from './route-tree';
import { generateControllersRecursive } from './recursive';
import { generateSharedTypes } from '../common/shared-types-generator';
import { segmentToExportName } from '../common/utils';

const HANDLER_METHODS = ['post', 'get', 'put', 'delete', 'patch', 'head', 'options'];

export function generateController(doc: OpenApiDocument, options: GenerationOptions, result: GeneratorResult): GeneratorResult {
  const { volume } = result;
  const controllerFolder = options.controller.path;
  const sharedTypesFolder = options.sharedTypes.path;
  
  volume.mkdirSync('/', { recursive: true });
  volume.mkdirSync(`/${controllerFolder}`, { recursive: true });
  volume.mkdirSync(`/${sharedTypesFolder}`, { recursive: true });

  const routeTree = buildRouteTree(doc);
  generateSharedTypes(volume, doc, `/${sharedTypesFolder}`);
  generateControllersRecursive(volume, routeTree, `/${controllerFolder}`, `/${sharedTypesFolder}`);
  generateRootIndexFile(volume, routeTree, `/${controllerFolder}`);

  const controllerShouldOverwrite = createControllerShouldOverwrite(controllerFolder, sharedTypesFolder);
  const shouldOverwrite = combineShouldOverwrite(result.shouldOverwrite, controllerShouldOverwrite);

  return { volume, shouldOverwrite };
}

function createControllerShouldOverwrite(controllerFolder: string, sharedTypesFolder: string): ShouldOverwriteFn {
  return (path: string) => {
    if (path.startsWith(`/${sharedTypesFolder}/`)) {
      return true;
    }

    if (!path.startsWith(`/${controllerFolder}/`)) {
      return false;
    }

    const fileName = path.split('/').pop() || '';
    const baseName = fileName.replace(/\.ts$/, '');

    if (HANDLER_METHODS.includes(baseName)) {
      return false;
    }

    return true;
  };
}

function combineShouldOverwrite(fn1: ShouldOverwriteFn, fn2: ShouldOverwriteFn): ShouldOverwriteFn {
  return (path: string) => fn1(path) || fn2(path);
}

function generateRootIndexFile(volume: Volume, tree: Map<string, import('./route-tree').RouteInfo>, controllerDir: string): void {
  const lines: string[] = [
    '// Auto-generated index file',
    '// DO NOT EDIT - This file is regenerated on each run',
    '',
  ];

  const segments = Array.from(tree.keys()).sort();
  for (const segment of segments) {
    const exportName = segmentToExportName(segment);
    lines.push(`export * as ${exportName} from './${segment}';`);
  }

  if (segments.length > 0) {
    volume.writeFileSync(`${controllerDir}/index.ts`, lines.join('\n'));
  }
}

