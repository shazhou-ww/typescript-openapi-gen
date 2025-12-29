import { OpenApiDocument, IR } from '../types';

/**
 * Loader 函数类型，负责加载和解析 OpenAPI document
 */
export type Loader = (filePath: string) => Promise<OpenApiDocument>;

/**
 * 完整的 Loader API，包含加载和转换功能
 */
export type LoaderAPI = {
  load: Loader;
  toIR: (document: OpenApiDocument) => IR;
};
