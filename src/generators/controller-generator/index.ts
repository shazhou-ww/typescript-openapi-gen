/**
 * generateController(doc: OpenApiDocument, result: GeneratorResult): GeneratorResult
 * - doc: OpenApiDocument
 * - result: 之前的生成结果
 * - 返回: 修饰后的生成结果
 */

import type { OpenApiDocument, GeneratorResult, ShouldOverwriteFn, Volume } from '../../types';
import { buildRouteTree } from './route-tree';
import { generateControllersRecursive } from './recursive';
import { generateSharedTypes } from '../shared-types-generator';
import { segmentToExportName } from '../utils';

const CONTROLLER_FOLDER = 'controller';
const SHARED_TYPES_FOLDER = 'shared-types';

const HANDLER_METHODS = ['post', 'get', 'put', 'delete', 'patch', 'head', 'options'];

export function generateController(doc: OpenApiDocument, result: GeneratorResult): GeneratorResult {
  const { volume } = result;
  
  volume.mkdirSync('/', { recursive: true });
  volume.mkdirSync(`/${CONTROLLER_FOLDER}`, { recursive: true });
  volume.mkdirSync(`/${SHARED_TYPES_FOLDER}`, { recursive: true });

  const routeTree = buildRouteTree(doc);
  generateSharedTypes(volume, doc, `/${SHARED_TYPES_FOLDER}`);
  generateControllersRecursive(volume, routeTree, `/${CONTROLLER_FOLDER}`, `/${SHARED_TYPES_FOLDER}`);
  generateRootIndexFile(volume, routeTree, `/${CONTROLLER_FOLDER}`);

  const controllerShouldOverwrite = createControllerShouldOverwrite();
  const shouldOverwrite = combineShouldOverwrite(result.shouldOverwrite, controllerShouldOverwrite);

  return { volume, shouldOverwrite };
}

function createControllerShouldOverwrite(): ShouldOverwriteFn {
  return (path: string) => {
    if (path.startsWith(`/${SHARED_TYPES_FOLDER}/`)) {
      return true;
    }

    if (!path.startsWith(`/${CONTROLLER_FOLDER}/`)) {
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

