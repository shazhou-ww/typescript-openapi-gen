/**
 * generateElysiaRouter(doc: OpenApiDocument, volume: Volume): Volume
 * - doc: OpenApiDocument
 * - volume: 内存文件系统
 * - 返回: 更新后的 Volume
 */

import type { OpenApiDocument, Volume } from '../types';
import { collectRoutes } from './route-collector';
import { extractPathParams, segmentToExportName } from './utils';

export function generateElysiaRouter(doc: OpenApiDocument, volume: Volume): Volume {
  const routes = collectRoutes(doc);
  const lines: string[] = [
    '// Auto-generated Elysia routes from OpenAPI specification',
    '// DO NOT EDIT - This file is regenerated on each run',
    '',
    "import { Elysia } from 'elysia';",
  ];

  // Get top-level modules
  const topLevelModules = getTopLevelModules(routes);
  if (topLevelModules.length > 0) {
    lines.push(`import { ${topLevelModules.join(', ')} } from './controller';`);
  }
  lines.push('');

  // Add plugin comment
  lines.push('/**');
  lines.push(' * Elysia plugin containing all generated routes.');
  lines.push(' * Usage: app.use(routerPlugin)');
  lines.push(' */');
  lines.push('export const routerPlugin = new Elysia()');

  // Generate routes
  for (const route of routes) {
    lines.push(generateRoute(route));
  }

  lines.push('');
  lines.push('export default routerPlugin');

  volume.mkdirSync('/', { recursive: true });
  volume.writeFileSync('/elysia-router.ts', lines.join('\n'));

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
  const elysiaPath = convertToElysiaPath(route.path);
  const inputParts = buildInputParts(route);
  const destructure = inputParts.length > 0 ? `{ ${inputParts.join(', ')} }` : '';
  const inputObject = buildInputObject(inputParts);

  return `  .${route.method}('${elysiaPath}', (${destructure}) => ${handlerCall}(${inputObject}))`;
}

function buildControllerPath(importPath: string[]): string {
  if (importPath.length === 0) return '';
  // Convert all segments to valid JavaScript identifiers using the same logic as exports
  const validSegments = importPath.map(segment => segmentToExportName(segment));
  return validSegments.join('.');
}

function convertToElysiaPath(path: string): string {
  return path.replace(/\{([^}]+)\}/g, ':$1');
}

function buildInputParts(route: ReturnType<typeof collectRoutes>[0]): string[] {
  const parts: string[] = [];

  // Check for path params
  const pathParams = extractPathParams(route.path);
  if (pathParams.length > 0) {
    parts.push('params');
  }

  // Check for query params
  if (Object.keys(route.operation.query).length > 0) {
    parts.push('query');
  }

  // Check for headers
  if (Object.keys(route.operation.headers).length > 0) {
    parts.push('headers');
  }

  // Check for request body
  if (route.operation.body !== null) {
    parts.push('body');
  }

  return parts;
}

function buildInputObject(parts: string[]): string {
  if (parts.length === 0) {
    return '{}';
  }
  return `{ ${parts.join(', ')} }`;
}

