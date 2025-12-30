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

  generateRouteFragment(doc: OpenApiDocument, routePaths: string[]): Record<string, unknown> {
    const paths: Record<string, unknown> = {};
    for (const routePath of routePaths) {
      const pathItem = doc.paths[routePath];
      if (pathItem) {
        paths[routePath] = OpenApiConverter.toPathItem(pathItem);
      }
    }
    return { paths };
  },

  generateSchemaFragment(doc: OpenApiDocument): Record<string, unknown> {
    const fullDoc = OpenApiConverter.toOpenApiFormat(doc);
    const schemas = (fullDoc.components as Record<string, unknown>)?.schemas || {};
    return {
      components: {
        schemas,
      },
    };
  },

  generateMainDocument(
    controllerFolders: ControllerFolderInfo[],
    controllerPath: string,
    sharedTypesPath: string,
    format: 'yaml' | 'json'
  ): Record<string, unknown> {
    const paths: Record<string, unknown> = {};
    
    for (const folder of controllerFolders) {
      const relativePath = getRelativePath(folder.folderPath, controllerPath);
      const fragmentPath = format === 'yaml' 
        ? `${relativePath}/route.yaml`
        : `${relativePath}/route.json`;
      
      for (const routePath of folder.routePaths) {
        paths[routePath] = {
          $ref: fragmentPath + `#/paths/${routePath.replace(/\//g, '~1')}`,
        };
      }
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
          $ref: schemaRef + '#/components/schemas',
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

