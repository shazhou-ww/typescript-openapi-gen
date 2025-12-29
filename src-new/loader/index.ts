/**
 * load(path: string): Promise<OpenApiDocument>
 * - path: OpenAPI 文件路径
 * - 返回: 规范化的 OpenApiDocument (IR)
 */

export { load } from './impl/loader';
