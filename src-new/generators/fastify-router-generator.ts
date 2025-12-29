/**
 * generateFastifyRouter(doc: OpenApiDocument, volume: Volume): Volume
 * - doc: OpenApiDocument
 * - volume: 内存文件系统
 * - 返回: 更新后的 Volume
 */

import type { OpenApiDocument, Volume } from '../types';
import { collectRoutes } from './route-collector';

export function generateFastifyRouter(doc: OpenApiDocument, volume: Volume): Volume {
  const routes = collectRoutes(doc);
  const lines: string[] = [
    '/**',
    ' * Generated Fastify router',
    ' */',
    '',
    "import type { FastifyInstance } from 'fastify';",
    '',
  ];

  const imports: string[] = [];
  const routeHandlers: string[] = [];

  for (const route of routes) {
    const importPath = `./controller/${route.controllerPath}`;
    imports.push(`import { ${route.handlerName} } from '${importPath}';`);
    routeHandlers.push(`  fastify.${route.method}('${route.path}', ${route.handlerName});`);
  }

  lines.push(...imports);
  lines.push('');
  lines.push('export function registerRoutes(fastify: FastifyInstance): void {');
  lines.push(...routeHandlers);
  lines.push('}');

  volume.mkdirSync('/', { recursive: true });
  volume.writeFileSync('/fastify-router.gen.ts', lines.join('\n'));

  return volume;
}

