/**
 * OpenApiFragmentGenerator: OpenAPI 片段生成相关的工具函数集合
 * 
 * 职责边界：
 * - 应该包含：所有与 OpenAPI 片段生成相关的工具函数（controller route 片段、shared types schema 片段等）
 * - 不应该包含：文件写入、路径计算、OpenAPI 格式转换等其他领域的工具函数
 * 
 * 导出: OpenApiFragmentGenerator 对象
 */

import type { OpenApiDocument } from '../../types';
import { PathUtil } from '../common/path-util';
import { OpenApiConverter } from './converter';

export type ControllerFolderInfo = {
  folderPath: string;
  routePaths: string[];
};

export const OpenApiFragmentGenerator = {
  collectControllerFolders(doc: OpenApiDocument, controllerPath: string): ControllerFolderInfo[] {
    const folderMap = new Map<string, string[]>();
    
    for (const routePath of Object.keys(doc.paths)) {
      const controllerFolder = routePathToControllerFolder(routePath, controllerPath);
      if (!folderMap.has(controllerFolder)) {
        folderMap.set(controllerFolder, []);
      }
      folderMap.get(controllerFolder)!.push(routePath);
    }
    
    return Array.from(folderMap.entries()).map(([folderPath, routePaths]) => ({
      folderPath,
      routePaths,
    }));
  },

  generateRouteFragment(doc: OpenApiDocument, routePaths: string[], schemaRefPath: string): Record<string, unknown> {
    const paths: Record<string, unknown> = {};
    for (const routePath of routePaths) {
      const pathItem = doc.paths[routePath];
      if (pathItem) {
        paths[routePath] = OpenApiConverter.toPathItem(pathItem, schemaRefPath);
      }
    }
    return { paths };
  },

  generateSingleRouteFragment(doc: OpenApiDocument, routePath: string, schemaRefPath: string): Record<string, unknown> {
    const pathItem = doc.paths[routePath];
    if (!pathItem) {
      return {};
    }
    return OpenApiConverter.toPathItem(pathItem, schemaRefPath);
  },

  routePathToFolderPath(routePath: string, controllerPath: string): string {
    const segments = routePath.split('/').filter(Boolean);
    if (segments.length === 0) {
      return controllerPath;
    }
    
    const firstSegment = PathUtil.segmentToFsName(segments[0]);
    const basePath = `${controllerPath}/${firstSegment}`;
    
    if (segments.length === 1) {
      return basePath;
    }
    
    const remainingSegments = segments.slice(1).map(seg => PathUtil.segmentToFsName(seg));
    return `${basePath}/${remainingSegments.join('/')}`;
  },

  generateSchemaFragment(doc: OpenApiDocument): Record<string, unknown> {
    const fullDoc = OpenApiConverter.toOpenApiFormat(doc);
    const schemas = (fullDoc.components as Record<string, unknown>)?.schemas || {};
    return schemas as Record<string, unknown>;
  },

  generateMainDocument(
    doc: OpenApiDocument,
    controllerPath: string,
    sharedTypesPath: string,
    format: 'yaml' | 'json'
  ): Record<string, unknown> {
    const paths: Record<string, unknown> = {};
    
    for (const routePath of Object.keys(doc.paths)) {
      const routeFolderPath = OpenApiFragmentGenerator.routePathToFolderPath(routePath, controllerPath);
      const fragmentPath = format === 'yaml' 
        ? `${routeFolderPath}/route.yaml`
        : `${routeFolderPath}/route.json`;
      
      paths[routePath] = {
        $ref: fragmentPath,
      };
    }
    
    const schemaRef = format === 'yaml' 
      ? `${sharedTypesPath}/schema.yaml`
      : `${sharedTypesPath}/schema.json`;
    
    return {
      openapi: '3.0.0',
      info: { title: 'Generated API', version: '1.0.0' },
      paths,
      components: {
        schemas: {
          $ref: schemaRef,
        },
      },
    };
  },
};

function routePathToControllerFolder(routePath: string, controllerPath: string): string {
  const segments = routePath.split('/').filter(Boolean);
  if (segments.length === 0) {
    return controllerPath;
  }
  
  const firstSegment = PathUtil.segmentToFsName(segments[0]);
  return `${controllerPath}/${firstSegment}`;
}

function getRelativePath(folderPath: string, controllerPath: string): string {
  if (folderPath === controllerPath) {
    return '.';
  }
  return folderPath.replace(controllerPath + '/', '');
}

