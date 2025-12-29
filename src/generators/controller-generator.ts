/**
 * generateController(doc: OpenApiDocument, volume: Volume): Volume
 * - doc: OpenApiDocument
 * - volume: 内存文件系统
 * - 返回: 更新后的 Volume
 */

import type { OpenApiDocument, Volume } from '../types';
import { buildRouteTree } from './route-tree';
import { generateControllersRecursive } from './controller-recursive';
import { generateSharedTypes } from './shared-types-generator';
import { segmentToExportName } from './utils';

const CONTROLLER_FOLDER = 'controller';
const SHARED_TYPES_FOLDER = 'shared-types';

export function generateController(doc: OpenApiDocument, volume: Volume): Volume {
  volume.mkdirSync('/', { recursive: true });
  volume.mkdirSync(`/${CONTROLLER_FOLDER}`, { recursive: true });
  volume.mkdirSync(`/${SHARED_TYPES_FOLDER}`, { recursive: true });

  const routeTree = buildRouteTree(doc);
  generateSharedTypes(volume, doc, `/${SHARED_TYPES_FOLDER}`);
  generateControllersRecursive(volume, routeTree, `/${CONTROLLER_FOLDER}`, `/${SHARED_TYPES_FOLDER}`);
  generateRootIndexFile(volume, routeTree, `/${CONTROLLER_FOLDER}`);

  return volume;
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
