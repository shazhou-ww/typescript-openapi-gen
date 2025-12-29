import { Analyzer } from '../../types';

/**
 * Analyzer 注册表类型
 */
export type AnalyzerRegistry = Map<string, Analyzer<any>>;

/**
 * 创建 analyzer 注册表
 */
export function createAnalyzerRegistry(): AnalyzerRegistry {
  return new Map<string, Analyzer<any>>();
}

/**
 * 注册 analyzer
 */
export function registerAnalyzer(
  registry: AnalyzerRegistry,
  name: string,
  analyzer: Analyzer<any>
): void {
  registry.set(name, analyzer);
}

/**
 * 获取 analyzer
 */
export function getAnalyzer(
  registry: AnalyzerRegistry,
  name: string
): Analyzer<any> | undefined {
  return registry.get(name);
}

/**
 * 获取所有已注册的 analyzer 名称
 */
export function getAnalyzerNames(registry: AnalyzerRegistry): string[] {
  return Array.from(registry.keys());
}
