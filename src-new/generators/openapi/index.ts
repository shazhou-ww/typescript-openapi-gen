import { Generator, OpenApiDocument, Volume } from '../../types';

/**
 * OpenAPI Generator - 生成 OpenAPI 规范
 */
export const openapiGenerator: Generator = async (document: OpenApiDocument, volume: Volume): Promise<Volume> => {
  // TODO: 实现 OpenAPI 生成逻辑
  console.log('Generating OpenAPI specification...');
  return volume;
};
