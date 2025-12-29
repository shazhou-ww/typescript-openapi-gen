/**
 * buildRouteTree(doc: OpenApiDocument): Map<string, RouteInfo>
 * - doc: OpenApiDocument
 * - 返回: 路由树，键为路径段，值为 RouteInfo
 */

import type { OpenApiDocument, PathItem, Operation, Method } from '../types';
import { routePathToFsPath, segmentToFsName } from './utils';

export type RouteInfo = {
  path: string;
  fsPath: string;
  methods: Map<Method, Operation>;
  children: Map<string, RouteInfo>;
};

export function buildRouteTree(doc: OpenApiDocument): Map<string, RouteInfo> {
  const tree = new Map<string, RouteInfo>();

  for (const [routePath, pathItem] of Object.entries(doc.paths)) {
    addRouteToTree(tree, routePath, pathItem);
  }

  return tree;
}

function addRouteToTree(
  tree: Map<string, RouteInfo>,
  routePath: string,
  pathItem: PathItem
): void {
  const segments = routePath.split('/').filter(Boolean);
  let current = tree;

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    const fsSegment = segmentToFsName(segment);
    const partialPath = '/' + segments.slice(0, i + 1).join('/');

    if (!current.has(fsSegment)) {
      current.set(fsSegment, createRouteInfo(partialPath));
    }

    const node = current.get(fsSegment)!;

    if (i === segments.length - 1) {
      addMethodsToNode(node, pathItem);
    }

    current = node.children;
  }
}

function createRouteInfo(partialPath: string): RouteInfo {
  return {
    path: partialPath,
    fsPath: routePathToFsPath(partialPath),
    methods: new Map(),
    children: new Map(),
  };
}

function addMethodsToNode(node: RouteInfo, pathItem: PathItem): void {
  for (const [method, operation] of Object.entries(pathItem.operations)) {
    if (operation) {
      node.methods.set(method as Method, operation);
    }
  }
}

