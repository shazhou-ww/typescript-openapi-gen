/**
 * generateFastifyRouter(doc: OpenApiDocument, options: GenerationOptions, result: GeneratorResult): GeneratorResult
 * - doc: OpenApiDocument
 * - options: 生成选项
 * - result: 之前的生成结果
 * - 返回: 修饰后的生成结果
 */

import type { OpenApiDocument, GenerationOptions } from '../../types';
import type { GeneratorResult, ShouldOverwriteFn } from '../types';
import { collectRoutes } from '../common/route-collector';
import { extractPathParams, segmentToExportName } from '../common/utils';

export function generateFastifyRouter(doc: OpenApiDocument, options: GenerationOptions, result: GeneratorResult): GeneratorResult {
  const { volume } = result;
  const routes = collectRoutes(doc);
  const lines: string[] = [
    '// Auto-generated Fastify routes from OpenAPI specification',
    '// DO NOT EDIT - This file is regenerated on each run',
    '',
    "import type { FastifyInstance } from 'fastify';",
  ];

  // Get top-level modules
  const topLevelModules = getTopLevelModules(routes);
  if (topLevelModules.length > 0) {
    lines.push(`import { ${topLevelModules.join(', ')} } from './controller';`);
  }
  lines.push('');
  lines.push('/**');
  lines.push(' * Decorates a Fastify instance with generated routes.');
  lines.push(' * Usage: await decorate(fastify)');
  lines.push(' */');
  lines.push('export async function decorate(fastify: FastifyInstance): Promise<void> {');

  // Generate routes
  for (const route of routes) {
    lines.push(generateRoute(route));
  }

  lines.push('}');
  lines.push('');
  lines.push('export default decorate');

  const routerPath = options.routers.fastify.path;
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
      modules.add(segmentToExportName(route.controllerImportPath[0]));
    }
  }
  return Array.from(modules).sort();
}

function generateRoute(route: ReturnType<typeof collectRoutes>[0]): string {
  const controllerPath = buildControllerPath(route.controllerImportPath);
  const handlerCall = `${controllerPath}.${route.handlerName}`;
  const fastifyPath = convertToFastifyPath(route.path);
  const inputParts = buildInputParts(route);
  const inputObject = buildInputObject(inputParts);

  const lines: string[] = [];
  lines.push(`  fastify.${route.method}('${fastifyPath}', async (request, reply) => {`);
  
  if (inputParts.includes('query')) {
    lines.push('    const query = request.query');
  }
  if (inputParts.includes('params')) {
    lines.push('    const params = request.params');
  }
  if (inputParts.includes('body')) {
    lines.push('    const body = request.body');
  }
  
  lines.push(`    const result = await ${handlerCall}(${inputObject})`);
  lines.push('    return result');
  lines.push('  })');
  
  return lines.join('\n');
}

function buildControllerPath(importPath: string[]): string {
  if (importPath.length === 0) return '';
  const validSegments = importPath.map(segment => segmentToExportName(segment));
  return validSegments.join('.');
}

function convertToFastifyPath(path: string): string {
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

