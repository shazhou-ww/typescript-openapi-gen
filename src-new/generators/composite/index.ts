import { Generator, OpenApiDocument, Volume } from '../../types';

/**
 * 组合 Generator
 * 将多个 generator 组合成一个
 */
export function createCompositeGenerator(generators: Generator[]): Generator {
  return async (document: OpenApiDocument, volume: Volume): Promise<Volume> => {
    let currentVolume = volume;

    for (const generator of generators) {
      currentVolume = await generator(document, currentVolume);
    }

    return currentVolume;
  };
}
