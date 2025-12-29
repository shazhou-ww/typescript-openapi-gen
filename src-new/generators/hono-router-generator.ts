/**
 * generateHonoRouter(doc: OpenApiDocument, volume: Volume): Volume
 * - doc: OpenApiDocument
 * - volume: 内存文件系统
 * - 返回: 更新后的 Volume
 */

import type { OpenApiDocument, Volume } from '../types';
import { collectRoutes } from './route-collector';

export function generateHonoRouter(doc: OpenApiDocument, volume: Volume): Volume {
  const routes = collectRoutes(doc);
  const lines: string[] = [
    '/**',
    ' * Generated Hono router',
    ' */',
    '',
    "import { Hono } from 'hono';",
    '',
  ];

  const imports: string[] = [];
  const routeHandlers: string[] = [];

  for (const route of routes) {
    const importPath = `./controller/${route.controllerPath}`;
    imports.push(`import { ${route.handlerName} } from '${importPath}';`);
    routeHandlers.push(`router.${route.method}('${route.path}', ${route.handlerName});`);
  }

  lines.push(...imports);
  lines.push('');
  lines.push('const router = new Hono();');
  lines.push('');
  lines.push(...routeHandlers);
  lines.push('');
  lines.push('export default router;');

  volume.mkdirSync('/', { recursive: true });
  volume.writeFileSync('/hono-router.gen.ts', lines.join('\n'));

  return volume;
}

