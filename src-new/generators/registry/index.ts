/**
 * createRegistryManager(): GeneratorRegistryManager
 * - 返回: 生成器注册表管理器，提供注册和查询功能
 */
import { Generator } from '../../types';

export type GeneratorRegistry = Map<string, Generator>;

export type GeneratorRegistryManager = {
  register: (name: string, generator: Generator) => void;
  get: (name: string) => Generator | undefined;
  getNames: () => string[];
};

export function createRegistryManager(): GeneratorRegistryManager {
  const registry: GeneratorRegistry = new Map();

  const register = (name: string, generator: Generator): void => {
    registry.set(name, generator);
  };

  const get = (name: string): Generator | undefined => {
    return registry.get(name);
  };

  const getNames = (): string[] => {
    return Array.from(registry.keys());
  };

  return { register, get, getNames };
}
