/**
 * createRegistryManager(): AnalyzerRegistryManager
 * - 返回: 分析器注册表管理器，提供注册和查询功能
 */
import { Analyzer } from '../../types';

export type AnalyzerRegistry = Map<string, Analyzer<any>>;

export type AnalyzerRegistryManager = {
  register: (name: string, analyzer: Analyzer<any>) => void;
  get: (name: string) => Analyzer<any> | undefined;
  getNames: () => string[];
};

export function createRegistryManager(): AnalyzerRegistryManager {
  const registry: AnalyzerRegistry = new Map();

  const register = (name: string, analyzer: Analyzer<any>): void => {
    registry.set(name, analyzer);
  };

  const get = (name: string): Analyzer<any> | undefined => {
    return registry.get(name);
  };

  const getNames = (): string[] => {
    return Array.from(registry.keys());
  };

  return { register, get, getNames };
}
