/**
 * generateTypesFile(volume: Volume, info: RouteInfo, controllerDir: string, sharedTypesDir: string): void
 * - volume: 内存文件系统
 * - info: 路由信息
 * - controllerDir: 控制器目录
 * - sharedTypesDir: 共享类型目录
 */

import type { Volume, Operation } from '../../types';
import type { RouteInfo } from './route-tree';
import { capitalize } from '../common/string-util';
import { PathUtil } from '../common/path-util';
import { schemaToTypeScript } from '../common/type-generator';
import { schemaToElysia } from '../common/elysia-schema-converter';

export function generateTypesFile(
  volume: Volume,
  info: RouteInfo,
  controllerDir: string,
  sharedTypesDir: string
): void {
  const lines: string[] = [
    '// Auto-generated types file',
    '// DO NOT EDIT - This file is regenerated on each run',
    '',
    "import { t } from 'elysia';",
    "import type { Static } from '@sinclair/typebox';",
    '',
  ];

  const referencedTypes = new Set<string>();

  for (const [method, operation] of info.methods) {
    addMethodTypes(lines, method, operation, info.path, referencedTypes, sharedTypesDir);
  }

  addImports(lines, referencedTypes, controllerDir, sharedTypesDir);
  volume.writeFileSync(`${controllerDir}/types.ts`, lines.join('\n'));
}

function addMethodTypes(
  lines: string[],
  method: string,
  operation: Operation,
  routePath: string,
  referencedTypes: Set<string>,
  sharedTypesDir: string
): void {
  const methodName = capitalize(method);
  const pathParams = PathUtil.extractPathParams(routePath);
  const hasQuery = Object.keys(operation.query).length > 0;
  const hasHeaders = Object.keys(operation.headers).length > 0;
  const hasBody = operation.body !== null;
  const inputParts: string[] = [];

  // Generate params schema and type
  if (pathParams.length > 0) {
    const paramsSchema = generateParamsSchema(pathParams);
    lines.push(`export const ${methodName}ParamsSchema = ${paramsSchema};`);
    lines.push(`export type ${methodName}Params = Static<typeof ${methodName}ParamsSchema>;`);
    lines.push('');
    inputParts.push('params');
  }

  // Generate query schema and type
  if (hasQuery) {
    const querySchema = generateParametersSchema(operation.query, 'query', referencedTypes, sharedTypesDir);
    lines.push(`export const ${methodName}QuerySchema = ${querySchema};`);
    lines.push(`export type ${methodName}Query = Static<typeof ${methodName}QuerySchema>;`);
    lines.push('');
    inputParts.push('query');
  }

  // Generate headers schema and type
  if (hasHeaders) {
    const headersSchema = generateParametersSchema(operation.headers, 'headers', referencedTypes, sharedTypesDir);
    lines.push(`export const ${methodName}HeadersSchema = ${headersSchema};`);
    lines.push(`export type ${methodName}Headers = Static<typeof ${methodName}HeadersSchema>;`);
    lines.push('');
    inputParts.push('headers');
  }

  // Generate body schema and type
  if (hasBody) {
    if ('$ref' in operation.body!) {
      lines.push(`export const ${methodName}BodySchema = ${operation.body.$ref}Schema;`);
      lines.push(`export type ${methodName}Body = Static<typeof ${methodName}BodySchema>;`);
      referencedTypes.add(operation.body.$ref);
    } else {
      const bodySchema = schemaToElysia(operation.body, sharedTypesDir);
      lines.push(`export const ${methodName}BodySchema = ${bodySchema};`);
      lines.push(`export type ${methodName}Body = Static<typeof ${methodName}BodySchema>;`);
    }
    lines.push('');
    inputParts.push('body');
  }

  // Generate Input type
  if (inputParts.length > 0) {
    const inputProps = inputParts.map(part => {
      const typeName = `${methodName}${capitalize(part)}`;
      return `  ${part}: ${typeName}`;
    }).join(';\n');
    lines.push(`export type ${methodName}Input = {`);
    lines.push(inputProps);
    lines.push('};');
    lines.push('');

    // Generate ElysiaRouteSchema for router validation
    const routeSchemaParts: string[] = [];
    if (pathParams.length > 0) {
      routeSchemaParts.push(`  params: ${methodName}ParamsSchema`);
    }
    if (hasQuery) {
      routeSchemaParts.push(`  query: ${methodName}QuerySchema`);
    }
    if (hasHeaders) {
      routeSchemaParts.push(`  headers: ${methodName}HeadersSchema`);
    }
    if (hasBody) {
      routeSchemaParts.push(`  body: ${methodName}BodySchema`);
    }
    
    if (routeSchemaParts.length > 0) {
      lines.push(`export const ${methodName}RouteSchema = {`);
      lines.push(routeSchemaParts.join(',\n'));
      lines.push('};');
    } else {
      lines.push(`export const ${methodName}RouteSchema = {};`);
    }
    lines.push('');
  } else {
    lines.push(`export type ${methodName}Input = {};`);
    lines.push(`export const ${methodName}RouteSchema = {};`);
    lines.push('');
  }

  // Generate Output type
  const response200 = operation.responses['200'] || operation.responses['201'];
  if (response200?.content) {
    const responseType = '$ref' in response200.content ? response200.content.$ref : schemaToTypeScript(response200.content);
    lines.push(`export type ${methodName}Output = ${responseType};`);
    if ('$ref' in response200.content) {
      referencedTypes.add(response200.content.$ref);
    }
  } else {
    lines.push(`export type ${methodName}Output = unknown;`);
  }
  lines.push('');
}

function generateParamsSchema(pathParams: string[]): string {
  if (pathParams.length === 0) return 't.Object({})';
  const props = pathParams.map(p => `  ${p}: t.String()`).join(',\n');
  return `t.Object({\n${props}\n})`;
}

function generateParametersSchema(
  parameters: Operation['query'],
  paramType: 'query' | 'headers',
  referencedTypes: Set<string>,
  sharedTypesDir: string
): string {
  if (Object.keys(parameters).length === 0) return 't.Object({})';

  const props: string[] = [];
  for (const [key, schema] of Object.entries(parameters)) {
    if ('$ref' in schema) {
      props.push(`  ${key}: ${schema.$ref}Schema`);
      referencedTypes.add(schema.$ref);
    } else {
      const elysiaSchema = schemaToElysia(schema, sharedTypesDir);
      const required = schema.required?.includes(key);
      const propElysia = required ? elysiaSchema : `t.Optional(${elysiaSchema})`;
      props.push(`  ${key}: ${propElysia}`);
    }
  }

  if (props.length === 0) return 't.Object({})';
  return `t.Object({\n${props.join(',\n')}\n})`;
}

function addImports(
  lines: string[],
  referencedTypes: Set<string>,
  controllerDir: string,
  sharedTypesDir: string
): void {
  if (referencedTypes.size === 0) return;

  const relativePath = getRelativePath(controllerDir, sharedTypesDir);
  const typeList = Array.from(referencedTypes).sort().join(', ');

  lines.splice(4, 0, `import type { ${typeList} } from '${relativePath}';`);
  lines.splice(5, 0, `import { ${Array.from(referencedTypes).map(t => `${t}Schema`).join(', ')} } from '${relativePath}';`);
}

function getRelativePath(from: string, to: string): string {
  const fromParts = from.split('/').filter(Boolean);
  const toParts = to.split('/').filter(Boolean);

  let i = 0;
  while (i < fromParts.length && i < toParts.length && fromParts[i] === toParts[i]) {
    i++;
  }

  const upLevels = fromParts.length - i;
  const downPath = toParts.slice(i).join('/');
  const upPath = upLevels > 0 ? '../'.repeat(upLevels) : './';
  return upPath + (downPath || '.');
}

