/**
 * createDefaultGeneratorRegistry(): GeneratorRegistryManager
 * - 返回: 配置了默认生成器的注册表管理器
 */
import { createRegistryManager } from '../registry';
import { controllerGenerator } from '../controller';
import { openapiGenerator } from '../openapi';
import { irGenerator } from '../ir';
import { formatterGenerator } from '../formatter';

export function createDefaultGeneratorRegistry() {
  const manager = createRegistryManager();

  // 基础 generators
  manager.register('controller', controllerGenerator);
  manager.register('openapi', openapiGenerator);
  manager.register('ir', irGenerator);
  manager.register('formatter', formatterGenerator);

  // Framework 特定的 generators
  // TODO: 实现各个框架的 generator
  manager.register('elysia-router', controllerGenerator); // 临时使用
  manager.register('express-router', controllerGenerator); // 临时使用
  manager.register('fastify-router', controllerGenerator); // 临时使用
  manager.register('hono-router', controllerGenerator); // 临时使用

  return manager;
}
