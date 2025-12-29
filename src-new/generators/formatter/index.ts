import { Generator, OpenApiDocument, Volume } from '../../types';

/**
 * Formatter Generator - 格式化代码
 */
export const formatterGenerator: Generator = async (document: OpenApiDocument, volume: Volume): Promise<Volume> => {
  // TODO: 实现格式化逻辑
  console.log('Formatting generated code...');
  return volume;
};
