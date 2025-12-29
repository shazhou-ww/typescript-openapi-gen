/**
 * generateTypesFile(volume: Volume, info: RouteInfo, controllerDir: string, sharedTypesDir: string): void
 * - volume: 内存文件系统
 * - info: 路由信息
 * - controllerDir: 控制器目录
 * - sharedTypesDir: 共享类型目录
 */

import type { Volume, Operation } from '../types';
import type { RouteInfo } from './route-tree';
import { capitalize } from './utils';
import { schemaToTypeScript } from './type-generator';

export function generateTypesFile(
  volume: Volume,
  info: RouteInfo,
  controllerDir: string,
  sharedTypesDir: string
): void {
  const lines: string[] = [
    '/**',
    ' * Generated types from OpenAPI specification',
    ' */',
    '',
    "import { z } from 'zod';",
    '',
  ];

  const referencedTypes = new Set<string>();

  for (const [method, operation] of info.methods) {
    addMethodTypes(lines, method, operation, referencedTypes);
  }

  addImports(lines, referencedTypes, controllerDir, sharedTypesDir);
  volume.writeFileSync(`${controllerDir}/types.gen.ts`, lines.join('\n'));
}

function addMethodTypes(
  lines: string[],
  method: string,
  operation: Operation,
  referencedTypes: Set<string>
): void {
  const methodName = capitalize(method);

  lines.push(`export type ${methodName}Input = {`);

  if (Object.keys(operation.query).length > 0) {
    lines.push('  query: {');
    for (const [key, schema] of Object.entries(operation.query)) {
      const optional = schema && !('$ref' in schema) && schema.required?.includes(key) ? '' : '?';
      const type = schema ? ('$ref' in schema ? schema.$ref : schemaToTypeScript(schema)) : 'unknown';
      lines.push(`    ${key}${optional}: ${type};`);
      if (schema && '$ref' in schema) {
        referencedTypes.add(schema.$ref);
      }
    }
    lines.push('  };');
  }

  if (operation.body) {
    const bodyType = '$ref' in operation.body ? operation.body.$ref : schemaToTypeScript(operation.body);
    lines.push(`  body: ${bodyType};`);
    if ('$ref' in operation.body) {
      referencedTypes.add(operation.body.$ref);
    }
  }

  lines.push('};');
  lines.push('');

  const response200 = operation.responses['200'] || operation.responses['201'];
  if (response200?.content) {
    const responseType = '$ref' in response200.content ? response200.content.$ref : schemaToTypeScript(response200.content);
    lines.push(`export type ${methodName}Output = ${responseType};`);
    if ('$ref' in response200.content) {
      referencedTypes.add(response200.content.$ref);
    }
  } else {
    lines.push(`export type ${methodName}Output = unknown;`);
  }
  lines.push('');
}

function addImports(
  lines: string[],
  referencedTypes: Set<string>,
  controllerDir: string,
  sharedTypesDir: string
): void {
  if (referencedTypes.size === 0) return;

  const relativePath = getRelativePath(controllerDir, sharedTypesDir);
  const typeList = Array.from(referencedTypes).sort().join(', ');

  lines.splice(5, 0, `import type { ${typeList} } from '${relativePath}';`);
  lines.splice(6, 0, `import { ${Array.from(referencedTypes).map(t => `${t}Schema`).join(', ')} } from '${relativePath}';`);
}

function getRelativePath(from: string, to: string): string {
  const fromParts = from.split('/').filter(Boolean);
  const toParts = to.split('/').filter(Boolean);

  let i = 0;
  while (i < fromParts.length && i < toParts.length && fromParts[i] === toParts[i]) {
    i++;
  }

  const upLevels = fromParts.length - i;
  const downPath = toParts.slice(i).join('/');
  const upPath = upLevels > 0 ? '../'.repeat(upLevels) : './';
  return upPath + (downPath || '.');
}

