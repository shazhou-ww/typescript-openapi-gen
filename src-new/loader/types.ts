import { OpenApiDocument } from '../types';

/**
 * Loader 函数类型，负责加载和解析 OpenAPI document
 */
export type Loader = (filePath: string) => Promise<OpenApiDocument>;
