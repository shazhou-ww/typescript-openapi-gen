/**
 * validateBasicStructure(document: OpenApiDocument): Generator<ValidationDiagnostic>
 * - document: OpenAPI 文档对象
 * - 返回: 基础结构验证诊断的生成器
 */
import { OpenApiDocument } from '../../types';
import { ValidationDiagnostic } from './types';

export function* validateBasicStructure(document: OpenApiDocument): Generator<ValidationDiagnostic> {
  // 检查必需字段
  if (!document.openapi && !('swagger' in document)) {
    yield {
      type: 'error',
      message: 'Missing required field: openapi or swagger',
      code: 'MISSING_VERSION',
    };
  }

  if (!document.info) {
    yield {
      type: 'error',
      message: 'Missing required field: info',
      code: 'MISSING_INFO',
    };
  }

  if (!document.paths) {
    yield {
      type: 'error',
      message: 'Missing required field: paths',
      code: 'MISSING_PATHS',
    };
  }
}
