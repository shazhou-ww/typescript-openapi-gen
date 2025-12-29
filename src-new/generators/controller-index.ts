/**
 * generateIndexFile(volume: Volume, info: RouteInfo, controllerDir: string): void
 * - volume: 内存文件系统
 * - info: 路由信息
 * - controllerDir: 控制器目录
 */

import type { Volume } from '../types';
import type { RouteInfo } from './route-tree';
import { capitalize } from './utils';

export function generateIndexFile(
  volume: Volume,
  info: RouteInfo,
  controllerDir: string
): void {
  const lines: string[] = [];

  for (const method of info.methods.keys()) {
    const methodName = capitalize(method);
    lines.push(`export { handle${methodName} } from './${method}';`);
  }

  if (info.children.size > 0) {
    lines.push('');
    for (const [segment] of info.children) {
      lines.push(`export * from './${segment}';`);
    }
  }

  if (lines.length > 0) {
    volume.writeFileSync(`${controllerDir}/index.ts`, lines.join('\n'));
  }
}

