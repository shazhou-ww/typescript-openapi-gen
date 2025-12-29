import { Generator, OpenApiDocument, Volume } from '../../types';

/**
 * IR Generator - 生成中间表示
 */
export const irGenerator: Generator = async (document: OpenApiDocument, volume: Volume): Promise<Volume> => {
  // TODO: 实现 IR 生成逻辑
  console.log('Generating intermediate representation...');
  return volume;
};
