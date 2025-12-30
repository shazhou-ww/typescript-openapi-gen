/**
 * generateOpenApi(doc: OpenApiDocument, options: GenerationOptions, result: GeneratorResult): GeneratorResult
 * - doc: OpenApiDocument
 * - options: 生成选项
 * - result: 之前的生成结果
 * - 返回: 修饰后的生成结果
 */

import type { OpenApiDocument, GenerationOptions, Volume } from '../../types';
import type { GeneratorResult, ShouldOverwriteFn } from '../types';
import * as yaml from 'js-yaml';
import { OpenApiConverter } from './converter';
import { OpenApiFragmentGenerator } from './fragment-generator';

export function generateOpenApi(doc: OpenApiDocument, options: GenerationOptions, result: GeneratorResult): GeneratorResult {
  const { volume } = result;
  const { openApi } = options;
  
  volume.mkdirSync('/', { recursive: true });

  if (openApi.inController) {
    generateFragmentedOpenApi(volume, doc, options);
  }

  if (openApi.allInOnePath) {
    generateAllInOneOpenApi(volume, doc, openApi.allInOnePath, openApi.format);
  }

  const openapiShouldOverwrite = createOpenApiShouldOverwrite(openApi);
  const shouldOverwrite = combineShouldOverwrite(result.shouldOverwrite, openapiShouldOverwrite);

  return { volume, shouldOverwrite };
}

function generateFragmentedOpenApi(volume: Volume, doc: OpenApiDocument, options: GenerationOptions): void {
  const { controller, sharedTypes, openApi } = options;
  const controllerFolders = OpenApiFragmentGenerator.collectControllerFolders(doc, controller.path);
  
  generateControllerRouteFragments(volume, doc, controllerFolders, controller.path, sharedTypes.path, openApi.format);
  generateSharedTypesSchema(volume, doc, sharedTypes.path, openApi.format);
  generateMainOpenApiDocument(volume, doc, controllerFolders, controller.path, sharedTypes.path, openApi.format);
}

function generateControllerRouteFragments(
  volume: Volume,
  doc: OpenApiDocument,
  controllerFolders: ReturnType<typeof OpenApiFragmentGenerator.collectControllerFolders>,
  controllerPath: string,
  sharedTypesPath: string,
  format: 'yaml' | 'json'
): void {
  for (const folder of controllerFolders) {
    for (const routePath of folder.routePaths) {
      const routeFolderPath = OpenApiFragmentGenerator.routePathToFolderPath(routePath, controllerPath);
      const relativeSchemaPath = getRelativeSchemaPath(routeFolderPath, controllerPath, sharedTypesPath);
      const fragment = OpenApiFragmentGenerator.generateSingleRouteFragment(doc, routePath, relativeSchemaPath);
      const fileName = format === 'yaml' ? 'route.yaml' : 'route.json';
      const filePath = `/${routeFolderPath}/${fileName}`;
      
      volume.mkdirSync(`/${routeFolderPath}`, { recursive: true });
      writeOpenApiFile(volume, filePath, fragment, format);
    }
  }
}

function getRelativeSchemaPath(folderPath: string, controllerPath: string, sharedTypesPath: string): string {
  const folderSegments = folderPath.split('/').filter(Boolean);
  const controllerSegments = controllerPath.split('/').filter(Boolean);
  const depth = folderSegments.length - controllerSegments.length;
  const relativePath = depth > 0 ? '../'.repeat(depth) + sharedTypesPath : sharedTypesPath;
  const fileName = 'schema.yaml';
  return `${relativePath}/${fileName}`;
}

function generateMainOpenApiDocument(
  volume: Volume,
  doc: OpenApiDocument,
  controllerFolders: ReturnType<typeof OpenApiFragmentGenerator.collectControllerFolders>,
  controllerPath: string,
  sharedTypesPath: string,
  format: 'yaml' | 'json'
): void {
  const mainDoc = OpenApiFragmentGenerator.generateMainDocument(doc, controllerPath, sharedTypesPath, format);
  const fileName = format === 'yaml' ? 'openapi.yaml' : 'openapi.json';
  writeOpenApiFile(volume, `/${fileName}`, mainDoc, format);
}

function generateSharedTypesSchema(
  volume: Volume,
  doc: OpenApiDocument,
  sharedTypesPath: string,
  format: 'yaml' | 'json'
): void {
  const fragment = OpenApiFragmentGenerator.generateSchemaFragment(doc);
  const fileName = format === 'yaml' ? 'schema.yaml' : 'schema.json';
  const filePath = `/${sharedTypesPath}/${fileName}`;
  
  volume.mkdirSync(`/${sharedTypesPath}`, { recursive: true });
  writeOpenApiFile(volume, filePath, fragment, format);
}


function generateAllInOneOpenApi(
  volume: Volume,
  doc: OpenApiDocument,
  allInOnePath: string,
  format: 'yaml' | 'json'
): void {
  const fullDoc = OpenApiConverter.toOpenApiFormat(doc);
  const dirPath = `/${allInOnePath}`;
  const fileName = format === 'yaml' ? 'openapi.yaml' : 'openapi.json';
  const filePath = `${dirPath}/${fileName}`;
  
  volume.mkdirSync(dirPath, { recursive: true });
  writeOpenApiFile(volume, filePath, fullDoc, format);
}

function writeOpenApiFile(volume: Volume, filePath: string, content: Record<string, unknown>, format: 'yaml' | 'json'): void {
  if (format === 'yaml') {
    const yamlContent = yaml.dump(content, { indent: 2, lineWidth: -1 });
    volume.writeFileSync(filePath, yamlContent);
  } else {
    const jsonContent = JSON.stringify(content, null, 2);
    volume.writeFileSync(filePath, jsonContent);
  }
}

function createOpenApiShouldOverwrite(openApi: GenerationOptions['openApi']): ShouldOverwriteFn {
  const paths: string[] = [];
  
  if (openApi.inController) {
    paths.push('/openapi.yaml', '/openapi.json');
  }
  
  if (openApi.allInOnePath) {
    const fileName = openApi.format === 'yaml' ? 'openapi.yaml' : 'openapi.json';
    paths.push(`/${openApi.allInOnePath}/${fileName}`);
  }
  
  return (path: string) => {
    if (paths.includes(path)) {
      return true;
    }
    if (openApi.inController) {
      if (path.endsWith('/route.yaml') || path.endsWith('/route.json')) {
        return true;
      }
      const sharedTypesPath = path.match(/^\/[^/]+\/schema\.(yaml|json)$/);
      if (sharedTypesPath) {
        return true;
      }
    }
    return false;
  };
}

function combineShouldOverwrite(fn1: ShouldOverwriteFn, fn2: ShouldOverwriteFn): ShouldOverwriteFn {
  return (path: string) => fn1(path) || fn2(path);
}

