import { createGeneratorRegistry, registerGenerator } from '../registry';
import { controllerGenerator } from '../controller';
import { openapiGenerator } from '../openapi';
import { irGenerator } from '../ir';
import { formatterGenerator } from '../formatter';

/**
 * 创建默认的 generator 注册表
 */
export function createDefaultGeneratorRegistry() {
  const registry = createGeneratorRegistry();

  // 基础 generators
  registerGenerator(registry, 'controller', controllerGenerator);
  registerGenerator(registry, 'openapi', openapiGenerator);
  registerGenerator(registry, 'ir', irGenerator);
  registerGenerator(registry, 'formatter', formatterGenerator);

  // Framework 特定的 generators
  // TODO: 实现各个框架的 generator
  registerGenerator(registry, 'elysia-router', controllerGenerator); // 临时使用
  registerGenerator(registry, 'express-router', controllerGenerator); // 临时使用
  registerGenerator(registry, 'fastify-router', controllerGenerator); // 临时使用
  registerGenerator(registry, 'hono-router', controllerGenerator); // 临时使用

  return registry;
}
