import { Generator } from '../../types';

/**
 * Generator 注册表类型
 */
export type GeneratorRegistry = Map<string, Generator>;

/**
 * 创建 generator 注册表
 */
export function createGeneratorRegistry(): GeneratorRegistry {
  return new Map<string, Generator>();
}

/**
 * 注册 generator
 */
export function registerGenerator(
  registry: GeneratorRegistry,
  name: string,
  generator: Generator
): void {
  registry.set(name, generator);
}

/**
 * 获取 generator
 */
export function getGenerator(
  registry: GeneratorRegistry,
  name: string
): Generator | undefined {
  return registry.get(name);
}

/**
 * 获取所有已注册的 generator 名称
 */
export function getGeneratorNames(registry: GeneratorRegistry): string[] {
  return Array.from(registry.keys());
}
