import { Diagnostic } from '../../types';

/**
 * 验证诊断类型
 */
export interface ValidationDiagnostic extends Diagnostic {
  code?: string;
}
