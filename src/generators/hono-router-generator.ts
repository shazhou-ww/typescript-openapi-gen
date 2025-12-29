/**
 * generateHonoRouter(doc: OpenApiDocument, volume: Volume): Volume
 * - doc: OpenApiDocument
 * - volume: 内存文件系统
 * - 返回: 更新后的 Volume
 */

import type { OpenApiDocument, Volume } from '../types';
import { collectRoutes } from './route-collector';
import { extractPathParams, segmentToExportName } from './utils';

export function generateHonoRouter(doc: OpenApiDocument, volume: Volume): Volume {
  const routes = collectRoutes(doc);
  const lines: string[] = [
    '// Auto-generated Hono routes from OpenAPI specification',
    '// DO NOT EDIT - This file is regenerated on each run',
    '',
    "import { Hono } from 'hono';",
  ];

  // Get top-level modules
  const topLevelModules = getTopLevelModules(routes);
  if (topLevelModules.length > 0) {
    lines.push(`import { ${topLevelModules.join(', ')} } from './controller';`);
  }
  lines.push('');
  lines.push('export const app = new Hono();');
  lines.push('');
  lines.push('/**');
  lines.push(' * Decorates a Hono app with generated routes.');
  lines.push(' * Usage: const app = new Hono(); decorate(app);');
  lines.push(' */');
  lines.push('export function decorate<T extends Hono>(app: T): T {');

  // Generate routes
  for (const route of routes) {
    lines.push(generateRoute(route));
  }

  lines.push('');
  lines.push('  return app');
  lines.push('}');
  lines.push('');
  lines.push('export default decorate');

  volume.mkdirSync('/', { recursive: true });
  volume.writeFileSync('/hono-router.ts', lines.join('\n'));

  return volume;
}

function getTopLevelModules(routes: ReturnType<typeof collectRoutes>): string[] {
  const modules = new Set<string>();
  for (const route of routes) {
    if (route.controllerImportPath.length > 0) {
      modules.add(segmentToExportName(route.controllerImportPath[0]));
    }
  }
  return Array.from(modules).sort();
}

function generateRoute(route: ReturnType<typeof collectRoutes>[0]): string {
  const controllerPath = buildControllerPath(route.controllerImportPath);
  const handlerCall = `${controllerPath}.${route.handlerName}`;
  const honoPath = convertToHonoPath(route.path);
  const inputParts = buildInputParts(route);
  const inputObject = buildInputObject(inputParts);

  const lines: string[] = [];
  lines.push(`  app.${route.method}('${honoPath}', async (c) => {`);
  
  if (inputParts.includes('query')) {
    lines.push('    const query = c.req.query()');
  }
  if (inputParts.includes('params')) {
    lines.push('    const params = c.req.param()');
  }
  if (inputParts.includes('body')) {
    lines.push('    const body = await c.req.json()');
  }
  
  lines.push(`    const result = await ${handlerCall}(${inputObject})`);
  lines.push('    return c.json(result)');
  lines.push('  })');
  
  return lines.join('\n');
}

function buildControllerPath(importPath: string[]): string {
  if (importPath.length === 0) return '';
  const validSegments = importPath.map(segment => segmentToExportName(segment));
  return validSegments.join('.');
}

function convertToHonoPath(path: string): string {
  return path.replace(/\{([^}]+)\}/g, ':$1');
}

function buildInputParts(route: ReturnType<typeof collectRoutes>[0]): string[] {
  const parts: string[] = [];
  const pathParams = extractPathParams(route.path);
  if (pathParams.length > 0) parts.push('params');
  if (Object.keys(route.operation.query).length > 0) parts.push('query');
  if (Object.keys(route.operation.headers).length > 0) parts.push('headers');
  if (route.operation.body !== null) parts.push('body');
  return parts;
}

function buildInputObject(parts: string[]): string {
  if (parts.length === 0) return '{}';
  return `{ ${parts.join(', ')} }`;
}

