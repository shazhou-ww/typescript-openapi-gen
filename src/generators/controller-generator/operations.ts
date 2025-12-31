/**
 * generateOperationsFile(volume: Volume, info: RouteInfo, controllerDir: string): void
 * - volume: 内存文件系统
 * - info: 路由信息
 * - controllerDir: 控制器目录
 */

import type { Volume, Operation, Method } from '../../types';
import type { RouteInfo } from './route-tree';
import { capitalize } from '../common/string-util';

export function generateOperationsFile(
  volume: Volume,
  info: RouteInfo,
  controllerDir: string
): void {
  if (info.methods.size === 0) return;

  const lines: string[] = [
    '// Auto-generated operations file',
    '// DO NOT EDIT - This file is regenerated on each run',
    '',
  ];

  // Import types
  const typeImports: string[] = [];
  for (const [method] of info.methods) {
    const methodName = capitalize(method);
    typeImports.push(`${methodName}Input`);
    typeImports.push(`${methodName}Output`);
  }

  if (typeImports.length === 1) {
    lines.push(`import type { ${typeImports[0]} } from './types';`);
  } else {
    lines.push('import type {');
    typeImports.forEach(t => lines.push(`  ${t},`));
    lines.push("} from './types';");
  }
  lines.push('');

  // Generate operation handlers
  for (const [method, operation] of info.methods) {
    generateOperationHandler(lines, method as Method, operation);
  }

  volume.writeFileSync(`${controllerDir}/operations.ts`, lines.join('\n'));
}

function generateOperationHandler(
  lines: string[],
  method: Method,
  operation: Operation
): void {
  const methodName = capitalize(method);
  const inputTypeName = `${methodName}Input`;
  const outputTypeName = `${methodName}Output`;

  lines.push(`export async function handle${methodName}(input: ${inputTypeName}): Promise<${outputTypeName}> {`);
  lines.push('  // @ts-ignore - Implementation required');
  lines.push("  throw new Error('Not implemented');");
  lines.push('}');
  lines.push('');
}


