/**
 * generateControllerFiles(volume: Volume, info: RouteInfo, controllerDir: string, sharedTypesDir: string): void
 * - volume: 内存文件系统
 * - info: 路由信息
 * - controllerDir: 控制器目录
 * - sharedTypesDir: 共享类型目录
 */

import type { Volume } from '../../types';
import type { RouteInfo } from './route-tree';
import { generateTypesFile } from './types';
import { generateOperationsFile } from './operations';
import { generateIndexFile } from './index-file';

export function generateControllerFiles(
  volume: Volume,
  info: RouteInfo,
  controllerDir: string,
  sharedTypesDir: string
): void {
  generateTypesFile(volume, info, controllerDir, sharedTypesDir);
  generateOperationsFile(volume, info, controllerDir);
  generateIndexFile(volume, info, controllerDir);
}

