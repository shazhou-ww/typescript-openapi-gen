/**
 * generateMethodsFile(volume: Volume, info: RouteInfo, controllerDir: string): void
 * - volume: 内存文件系统
 * - info: 路由信息
 * - controllerDir: 控制器目录
 */

import type { Volume } from '../types';
import type { RouteInfo } from './route-tree';
import { capitalize } from './utils';

export function generateMethodsFile(
  volume: Volume,
  info: RouteInfo,
  controllerDir: string,
  sharedTypesDir: string
): void {
  if (info.methods.size === 0) return;

  const lines: string[] = [
    '// Auto-generated methods file',
    '// DO NOT EDIT - This file is regenerated on each run',
    '',
  ];

  // Import user-defined handlers
  for (const method of info.methods.keys()) {
    const methodName = capitalize(method);
    lines.push(`import { handle${methodName} as _handle${methodName} } from './${method}';`);
  }
  lines.push('');

  // Import types and schemas
  const typeImports: string[] = [];
  const schemaImports: string[] = [];
  const bodySchemas: Map<string, string> = new Map();

  for (const [method, operation] of info.methods) {
    const methodName = capitalize(method);
    typeImports.push(`${methodName}Output`);
    schemaImports.push(`${methodName}InputSchema`);

    // Body schema is always validated separately
    if (operation.body) {
      schemaImports.push(`${methodName}BodySchema`);
      bodySchemas.set(methodName, `${methodName}BodySchema`);
    }
  }

  // Format type imports
  if (typeImports.length === 1) {
    lines.push(`import type { ${typeImports[0]} } from './types';`);
  } else {
    lines.push("import type {");
    typeImports.forEach(t => lines.push(`  ${t},`));
    lines.push("} from './types';");
  }
  lines.push('');

  // Format schema imports
  if (schemaImports.length === 1) {
    lines.push(`import { ${schemaImports[0]} } from './types';`);
  } else {
    lines.push('import {');
    schemaImports.forEach(s => lines.push(`  ${s},`));
    lines.push("} from './types';");
  }
  lines.push('');

  // Generate wrapper functions
  for (const [method, operation] of info.methods) {
    const methodName = capitalize(method);
    const hasBody = operation.body !== null;
    const bodySchema = bodySchemas.get(methodName);

    lines.push(`export async function handle${methodName}(input: unknown): Promise<${methodName}Output> {`);

    // Validate input (params, query, headers)
    lines.push(`  const validatedInput = ${methodName}InputSchema.parse(input);`);

    // Validate body separately if exists
    if (bodySchema) {
      lines.push(`  const inputObj = input as any;`);
      lines.push(`  const validatedBody = ${bodySchema}.parse(inputObj.body);`);
      lines.push(`  const validated = { ...validatedInput, body: validatedBody };`);
      lines.push(`  return _handle${methodName}(validated);`);
    } else {
      lines.push(`  return _handle${methodName}(validatedInput);`);
    }

    lines.push('}');
    lines.push('');
  }

  volume.writeFileSync(`${controllerDir}/methods.ts`, lines.join('\n'));
}

