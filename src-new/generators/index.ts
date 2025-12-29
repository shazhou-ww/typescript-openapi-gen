// 导出类型
export type { GeneratorRegistry } from './registry';

// 导出注册表函数
export {
  createGeneratorRegistry,
  registerGenerator,
  getGenerator,
  getGeneratorNames,
} from './registry';

// 导出组合 generator 函数
export { createCompositeGenerator } from './composite';

// 导出各个 generator
export { controllerGenerator } from './controller';
export { openapiGenerator } from './openapi';
export { irGenerator } from './ir';
export { formatterGenerator } from './formatter';

// 导出默认注册表创建函数
export { createDefaultGeneratorRegistry } from './defaults';
