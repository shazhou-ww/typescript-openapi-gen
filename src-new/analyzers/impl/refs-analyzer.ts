/**
 * analyzeRefs(doc: OpenApiDocument): Diagnostic[]
 * - doc: OpenApiDocument
 * - 返回: 引用分析的诊断结果
 */

import type { OpenApiDocument, Diagnostic, JSONSchema, Ref } from '../../types';

export function analyzeRefs(doc: OpenApiDocument): Diagnostic[] {
  const diagnostics: Diagnostic[] = [];
  const definedTypes = new Set(Object.keys(doc.types));

  for (const [path, pathItem] of Object.entries(doc.paths)) {
    checkParameters(pathItem.parameters, path, 'path', definedTypes, diagnostics);

    for (const [method, operation] of Object.entries(pathItem.operations)) {
      if (!operation) continue;
      const loc = `paths.${path}.${method}`;

      checkParameters(operation.query, loc, 'query', definedTypes, diagnostics);
      checkParameters(operation.headers, loc, 'headers', definedTypes, diagnostics);
      checkParameters(operation.cookie, loc, 'cookie', definedTypes, diagnostics);
      checkSchemaOrRef(operation.body, loc, 'body', definedTypes, diagnostics);

      for (const [status, response] of Object.entries(operation.responses)) {
        checkSchemaOrRef(response.content, `${loc}.responses.${status}`, 'content', definedTypes, diagnostics);
      }
    }
  }

  return diagnostics;
}

function checkParameters(
  params: Record<string, JSONSchema | Ref>,
  location: string,
  paramType: string,
  definedTypes: Set<string>,
  diagnostics: Diagnostic[]
): void {
  for (const [name, schemaOrRef] of Object.entries(params)) {
    checkSchemaOrRef(schemaOrRef, location, `${paramType}.${name}`, definedTypes, diagnostics);
  }
}

function checkSchemaOrRef(
  value: JSONSchema | Ref | null,
  location: string,
  field: string,
  definedTypes: Set<string>,
  diagnostics: Diagnostic[]
): void {
  if (!value) return;
  if (isRef(value)) {
    if (!definedTypes.has(value.$ref)) {
      diagnostics.push({
        type: 'error',
        message: `Reference '${value.$ref}' is not defined in types`,
        location: { file: `${location}.${field}`, line: null, column: null },
        code: 'UNDEFINED_REF',
      });
    }
  }
}

function isRef(value: JSONSchema | Ref): value is Ref {
  return '$ref' in value;
}

