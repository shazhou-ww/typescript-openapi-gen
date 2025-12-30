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
  
  generateControllerRouteFragments(volume, doc, controllerFolders, controller.path, openApi.format);
  generateSharedTypesSchema(volume, doc, sharedTypes.path, openApi.format);
  generateMainOpenApiDocument(volume, doc, controllerFolders, controller.path, sharedTypes.path, openApi.format);
}

function generateControllerRouteFragments(
  volume: Volume,
  doc: OpenApiDocument,
  controllerFolders: ReturnType<typeof OpenApiFragmentGenerator.collectControllerFolders>,
  controllerPath: string,
  format: 'yaml' | 'json'
): void {
  for (const folder of controllerFolders) {
    const fragment = OpenApiFragmentGenerator.generateRouteFragment(doc, folder.routePaths);
    const fileName = format === 'yaml' ? 'route.yaml' : 'route.json';
    const filePath = `/${folder.folderPath}/${fileName}`;
    
    volume.mkdirSync(`/${folder.folderPath}`, { recursive: true });
    writeOpenApiFile(volume, filePath, fragment, format);
  }
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

function generateMainOpenApiDocument(
  volume: Volume,
  doc: OpenApiDocument,
  controllerFolders: ReturnType<typeof OpenApiFragmentGenerator.collectControllerFolders>,
  controllerPath: string,
  sharedTypesPath: string,
  format: 'yaml' | 'json'
): void {
  const mainDoc = mergeFragmentsIntoMainDocument(doc, controllerFolders);
  const fileName = format === 'yaml' ? 'openapi.yaml' : 'openapi.json';
  writeOpenApiFile(volume, `/${fileName}`, mainDoc, format);
}

function mergeFragmentsIntoMainDocument(
  doc: OpenApiDocument,
  controllerFolders: ReturnType<typeof OpenApiFragmentGenerator.collectControllerFolders>
): Record<string, unknown> {
  const fullDoc = OpenApiConverter.toOpenApiFormat(doc);
  return {
    ...fullDoc,
    'x-fragments': {
      controllers: controllerFolders.map(f => f.folderPath),
      note: 'This document is generated from fragments. See individual route.yaml/json files in controller folders.',
    },
  };
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

