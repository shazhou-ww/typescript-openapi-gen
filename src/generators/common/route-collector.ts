/**
 * collectRoutes(doc: OpenApiDocument): FlatRoute[]
 * - doc: OpenApiDocument
 * - 返回: 扁平化的路由列表
 */

import type { OpenApiDocument, PathItem, Operation, Method } from '../../types';
import { capitalize } from './string-util';

export type FlatRoute = {
  path: string;
  method: Method;
  operation: Operation;
  handlerName: string;
  controllerPath: string;
  controllerImportPath: string[];
};

const METHOD_ORDER: Method[] = ['get', 'post', 'put', 'patch', 'delete', 'options', 'head'];

export function collectRoutes(doc: OpenApiDocument): FlatRoute[] {
  const routes: FlatRoute[] = [];

  for (const [routePath, pathItem] of Object.entries(doc.paths)) {
    for (const [method, operation] of Object.entries(pathItem.operations)) {
      if (!operation) continue;

      const methodName = capitalize(method);
      const controllerPath = routePathToControllerPath(routePath);
      const controllerImportPath = routePathToControllerImportPath(routePath);

      routes.push({
        path: routePath,
        method: method as Method,
        operation,
        handlerName: `handle${methodName}`,
        controllerPath,
        controllerImportPath,
      });
    }
  }

  return routes.sort((a, b) => {
    const pathCompare = a.path.localeCompare(b.path);
    if (pathCompare !== 0) return pathCompare;
    return METHOD_ORDER.indexOf(a.method) - METHOD_ORDER.indexOf(b.method);
  });
}

function routePathToControllerPath(routePath: string): string {
  return routePath
    .split('/')
    .filter(Boolean)
    .map(segment => segment.replace(/^\{(.+)\}$/, '_$1'))
    .join('/');
}

function routePathToControllerImportPath(routePath: string): string[] {
  return routePath
    .split('/')
    .filter(Boolean)
    .map(segment => segment.replace(/^\{(.+)\}$/, '_$1'));
}

