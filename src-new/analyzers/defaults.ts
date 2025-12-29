/**
 * createDefaultAnalyzerRegistry(): AnalyzerRegistry
 * - 返回: 配置了默认分析器的注册表
 */
import { createRegistryManager } from './registry';
import { createOpenApiValidator } from './validator';

export function createDefaultAnalyzerRegistry() {
  const manager = createRegistryManager();
  manager.register('validator', createOpenApiValidator());
  return manager;
}
