import { createAnalyzerRegistry, registerAnalyzer } from './registry';
import { createOpenApiValidator } from './validator';

/**
 * 创建默认的 analyzer 注册表
 */
export function createDefaultAnalyzerRegistry() {
  const registry = createAnalyzerRegistry();
  registerAnalyzer(registry, 'validator', createOpenApiValidator());
  return registry;
}
