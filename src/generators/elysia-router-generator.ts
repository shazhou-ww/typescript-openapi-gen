/**
 * generateElysiaRouter(doc: OpenApiDocument, volume: Volume): Volume
 * - doc: OpenApiDocument
 * - volume: 内存文件系统
 * - 返回: 更新后的 Volume
 */

import type { OpenApiDocument, Volume } from '../types';
import { collectRoutes } from './route-collector';

export function generateElysiaRouter(doc: OpenApiDocument, volume: Volume): Volume {
  const routes = collectRoutes(doc);
  const lines: string[] = [
    '/**',
    ' * Generated Elysia router',
    ' */',
    '',
    "import { Elysia } from 'elysia';",
    '',
  ];

  const imports: string[] = [];
  const routeHandlers: string[] = [];

  for (const route of routes) {
    const importPath = `./controller/${route.controllerPath}`;
    const alias = route.handlerName + '_' + route.controllerPath.replace(/\//g, '_').replace(/[^a-zA-Z0-9_]/g, '_');
    imports.push(`import { ${route.handlerName} as ${alias} } from '${importPath}';`);
    routeHandlers.push(`  .${route.method}('${route.path}', ${alias})`);
  }

  lines.push(...imports);
  lines.push('');
  lines.push('export const router = new Elysia()');
  lines.push(...routeHandlers);
  lines.push(';');

  volume.mkdirSync('/', { recursive: true });
  volume.writeFileSync('/elysia-router.gen.ts', lines.join('\n'));

  return volume;
}

