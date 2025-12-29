/**
 * generateControllersRecursive(volume: Volume, tree: Map<string, RouteInfo>, controllerDir: string, sharedTypesDir: string): void
 * - volume: 内存文件系统
 * - tree: 路由树
 * - controllerDir: 控制器目录
 * - sharedTypesDir: 共享类型目录
 */

import type { Volume } from '../types';
import type { RouteInfo } from './route-tree';
import { generateControllerFiles } from './controller-files';

export function generateControllersRecursive(
  volume: Volume,
  tree: Map<string, RouteInfo>,
  controllerDir: string,
  sharedTypesDir: string
): void {
  for (const [segment, info] of tree) {
    const currentDir = `${controllerDir}/${segment}`;
    volume.mkdirSync(currentDir, { recursive: true });

    if (info.methods.size > 0) {
      generateControllerFiles(volume, info, currentDir, sharedTypesDir);
    }

    if (info.children.size > 0) {
      generateControllersRecursive(volume, info.children, currentDir, sharedTypesDir);
    }
  }
}

