/**
 * generateControllerFiles(volume: Volume, info: RouteInfo, controllerDir: string, sharedTypesDir: string): void
 * - volume: 内存文件系统
 * - info: 路由信息
 * - controllerDir: 控制器目录
 * - sharedTypesDir: 共享类型目录
 */

import type { Volume, Operation, Method } from '../../types';
import type { RouteInfo } from './route-tree';
import { capitalize } from '../utils';
import { generateTypesFile } from './types';
import { generateMethodFile } from './method';
import { generateIndexFile } from './index-file';
import { generateMethodsFile } from './methods';

export function generateControllerFiles(
  volume: Volume,
  info: RouteInfo,
  controllerDir: string,
  sharedTypesDir: string
): void {
  generateTypesFile(volume, info, controllerDir, sharedTypesDir);

  for (const [method, operation] of info.methods) {
    generateMethodFile(volume, method as Method, operation, controllerDir);
  }

  generateMethodsFile(volume, info, controllerDir, sharedTypesDir);
  generateIndexFile(volume, info, controllerDir);
}

