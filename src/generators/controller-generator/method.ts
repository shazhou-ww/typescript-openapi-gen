/**
 * generateMethodFile(volume: Volume, method: Method, operation: Operation, controllerDir: string): void
 * - volume: 内存文件系统
 * - method: HTTP 方法
 * - operation: 操作定义
 * - controllerDir: 控制器目录
 */

import type { Volume, Operation, Method } from '../../types';
import { capitalize } from '../common/string-util';

export function generateMethodFile(
  volume: Volume,
  method: Method,
  operation: Operation,
  controllerDir: string
): void {
  const methodName = capitalize(method);
  const outputTypeName = `${methodName}Output`;
  const filePath = `${controllerDir}/${method}.ts`;

  // Don't overwrite if file already exists
  if (volume.existsSync(filePath)) {
    return;
  }

  const content = `/**
 * ${methodName} handler
 */

import type { ${methodName}Input, ${outputTypeName} } from './types';

export async function handle${methodName}(input: ${methodName}Input): Promise<${outputTypeName}> {
  // @ts-ignore - Implementation required
  throw new Error('Not implemented');
}
`;

  volume.writeFileSync(filePath, content);
}

