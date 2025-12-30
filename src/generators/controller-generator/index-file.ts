/**
 * generateIndexFile(volume: Volume, info: RouteInfo, controllerDir: string): void
 * - volume: 内存文件系统
 * - info: 路由信息
 * - controllerDir: 控制器目录
 */

import type { Volume } from '../../types';
import type { RouteInfo } from './route-tree';
import { capitalize, segmentToExportName } from '../common/utils';

export function generateIndexFile(
  volume: Volume,
  info: RouteInfo,
  controllerDir: string
): void {
  const lines: string[] = [
    '// Auto-generated index file',
    '// DO NOT EDIT - This file is regenerated on each run',
    '',
  ];

  // Export types
  const typeExports: string[] = [];
  for (const [method, operation] of info.methods) {
    const methodName = capitalize(method);
    typeExports.push(`${methodName}Input`);
    typeExports.push(`${methodName}Output`);
  }

  if (typeExports.length > 0) {
    if (typeExports.length === 1) {
      lines.push(`export type { ${typeExports[0]} } from './types';`);
    } else {
      lines.push('export type {');
      typeExports.forEach(t => lines.push(`  ${t},`));
      lines.push("} from './types';");
    }
    lines.push('');
  }

  // Export methods
  if (info.methods.size > 0) {
    for (const method of info.methods.keys()) {
      const methodName = capitalize(method);
      lines.push(`export { handle${methodName} } from './methods';`);
    }
  }

  // Export child routes
  if (info.children.size > 0) {
    // Add empty line before child exports if there are methods or types
    if (info.methods.size > 0 || typeExports.length > 0) {
      lines.push('');
    }
    for (const [segment] of info.children) {
      const exportName = segmentToExportName(segment);
      lines.push(`export * as ${exportName} from './${segment}';`);
    }
  }

  // Always generate index.ts if there are methods or children
  if (info.methods.size > 0 || info.children.size > 0) {
    volume.writeFileSync(`${controllerDir}/index.ts`, lines.join('\n'));
  }
}

