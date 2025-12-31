/**
 * generateElysiaRouter(doc: OpenApiDocument, options: GenerationOptions, result: GeneratorResult): GeneratorResult
 * - doc: OpenApiDocument
 * - options: 生成选项
 * - result: 之前的生成结果
 * - 返回: 修饰后的生成结果
 */

import type { OpenApiDocument, GenerationOptions } from '../../types';
import type { GeneratorResult, ShouldOverwriteFn } from '../types';
import { collectRoutes } from '../common/route-collector';
import { PathUtil } from '../common/path-util';

export function generateElysiaRouter(doc: OpenApiDocument, options: GenerationOptions, result: GeneratorResult): GeneratorResult {
  const { volume } = result;
  const routes = collectRoutes(doc);
  const lines: string[] = [
    '// Auto-generated Elysia routes from OpenAPI specification',
    '// DO NOT EDIT - This file is regenerated on each run',
    '',
    "import { Elysia } from 'elysia';",
  ];

  // Get top-level modules
  // Schema is imported from the same controller modules as handlers
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

  const routerPath = options.routers.elysia.path;
  const filePath = `/${routerPath}`;

  volume.mkdirSync('/', { recursive: true });
  volume.writeFileSync(filePath, lines.join('\n'));

  const routerShouldOverwrite: ShouldOverwriteFn = (path: string) => path === filePath;
  const shouldOverwrite = combineShouldOverwrite(result.shouldOverwrite, routerShouldOverwrite);

  return { volume, shouldOverwrite };
}

function combineShouldOverwrite(fn1: ShouldOverwriteFn, fn2: ShouldOverwriteFn): ShouldOverwriteFn {
  return (path: string) => fn1(path) || fn2(path);
}

function getTopLevelModules(routes: ReturnType<typeof collectRoutes>): string[] {
  const modules = new Set<string>();
  for (const route of routes) {
    if (route.controllerImportPath.length > 0) {
      modules.add(PathUtil.segmentToExportName(route.controllerImportPath[0]));
    }
  }
  return Array.from(modules).sort();
}

function buildSchemaPath(importPath: string[], method: string): string {
  if (importPath.length === 0) {
    return getRouteSchemaName(method);
  }
  const validSegments = importPath.map(segment => PathUtil.segmentToExportName(segment));
  const schemaPath = validSegments.join('.');
  return `${schemaPath}.${getRouteSchemaName(method)}`;
}

function getRouteSchemaName(method: string): string {
  return method.charAt(0).toUpperCase() + method.slice(1);
}

function hasAnySchema(route: ReturnType<typeof collectRoutes>[0]): boolean {
  const pathParams = PathUtil.extractPathParams(route.path);
  const hasQuery = Object.keys(route.operation.query).length > 0;
  const hasHeaders = Object.keys(route.operation.headers).length > 0;
  const hasBody = route.operation.body !== null;
  return pathParams.length > 0 || hasQuery || hasHeaders || hasBody;
}

function generateRoute(route: ReturnType<typeof collectRoutes>[0]): string {
  const controllerPath = buildControllerPath(route.controllerImportPath);
  const handlerCall = `${controllerPath}.${route.handlerName}`;
  const schemaPath = buildSchemaPath(route.controllerImportPath, route.method);
  const elysiaPath = convertToElysiaPath(route.path);
  const inputParts = buildInputParts(route);
  const destructure = inputParts.length > 0 ? `{ ${inputParts.join(', ')} }` : '';
  const inputObject = buildInputObject(inputParts);
  const routeSchema = `${schemaPath}RouteSchema`;

  const hasSchema = hasAnySchema(route);
  if (hasSchema) {
    return `  .${route.method}('${elysiaPath}', (${destructure}) => ${handlerCall}(${inputObject}), ${routeSchema})`;
  } else {
    return `  .${route.method}('${elysiaPath}', (${destructure}) => ${handlerCall}(${inputObject}))`;
  }
}

function buildControllerPath(importPath: string[]): string {
  if (importPath.length === 0) return '';
  // Convert all segments to valid JavaScript identifiers using the same logic as exports
  const validSegments = importPath.map(segment => PathUtil.segmentToExportName(segment));
  return validSegments.join('.');
}

function convertToElysiaPath(path: string): string {
  return path.replace(/\{([^}]+)\}/g, ':$1');
}

function buildInputParts(route: ReturnType<typeof collectRoutes>[0]): string[] {
  const parts: string[] = [];

  // Check for path params
  const pathParams = PathUtil.extractPathParams(route.path);
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

