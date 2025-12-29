/**
 * analyzeStructure(doc: OpenApiDocument): Diagnostic[]
 * - doc: OpenApiDocument
 * - 返回: 结构分析的诊断结果
 */

import type { OpenApiDocument, Diagnostic } from '../types';

export function analyzeStructure(doc: OpenApiDocument): Diagnostic[] {
  const diagnostics: Diagnostic[] = [];

  if (Object.keys(doc.paths).length === 0) {
    diagnostics.push({
      type: 'warning',
      message: 'No paths defined in the document',
      location: null,
      code: 'NO_PATHS',
    });
  }

  for (const [path, pathItem] of Object.entries(doc.paths)) {
    if (Object.keys(pathItem.operations).length === 0) {
      diagnostics.push({
        type: 'warning',
        message: `Path '${path}' has no operations defined`,
        location: { file: `paths.${path}`, line: null, column: null },
        code: 'NO_OPERATIONS',
      });
    }
  }

  return diagnostics;
}

