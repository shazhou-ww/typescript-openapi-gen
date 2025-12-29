/**
 * generateExpressRouter(doc: OpenApiDocument, volume: Volume): Volume
 * - doc: OpenApiDocument
 * - volume: 内存文件系统
 * - 返回: 更新后的 Volume
 */

import type { OpenApiDocument, Volume } from '../types';
import { collectRoutes } from './route-collector';
import { extractPathParams, segmentToExportName } from './utils';

export function generateExpressRouter(doc: OpenApiDocument, volume: Volume): Volume {
  const routes = collectRoutes(doc);
  const lines: string[] = [
    '// Auto-generated Express routes from OpenAPI specification',
    '// DO NOT EDIT - This file is regenerated on each run',
    '',
    "import { Router } from 'express';",
  ];

  // Get top-level modules
  const topLevelModules = getTopLevelModules(routes);
  if (topLevelModules.length > 0) {
    lines.push(`import { ${topLevelModules.join(', ')} } from './controller';`);
  }
  lines.push('');
  lines.push('export const router = Router();');
  lines.push('');

  // Generate routes
  for (const route of routes) {
    lines.push(generateRoute(route));
  }

  lines.push('');
  lines.push('export default router;');

  volume.mkdirSync('/', { recursive: true });
  volume.writeFileSync('/express-router.ts', lines.join('\n'));

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
  const expressPath = convertToExpressPath(route.path);
  const inputParts = buildInputParts(route);
  const inputObject = buildInputObject(inputParts);

  const lines: string[] = [];
  lines.push(`router.${route.method}('${expressPath}', async (req, res, next) => {`);
  
  if (inputParts.includes('query')) {
    lines.push('  const query = req.query');
  }
  if (inputParts.includes('params')) {
    lines.push('  const params = req.params');
  }
  if (inputParts.includes('body')) {
    lines.push('  const body = req.body');
  }
  
  lines.push(`  const result = await ${handlerCall}(${inputObject})`);
  lines.push('  res.json(result)');
  lines.push('})');
  
  return lines.join('\n');
}

function buildControllerPath(importPath: string[]): string {
  if (importPath.length === 0) return '';
  const validSegments = importPath.map(segment => segmentToExportName(segment));
  return validSegments.join('.');
}

function convertToExpressPath(path: string): string {
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

