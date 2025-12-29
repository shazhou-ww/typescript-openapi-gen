/**
 * validateOpenApiDocument(doc: unknown): asserts doc is Record<string, unknown>
 * - doc: 要验证的文档对象
 * - 返回: 通过类型断言验证文档结构，无返回值
 */
export function validateOpenApiDocument(doc: unknown): asserts doc is Record<string, unknown> {
  if (!doc || typeof doc !== 'object') {
    throw new Error('Invalid OpenAPI document: not an object');
  }

  const docObj = doc as Record<string, unknown>;

  if (!docObj['openapi'] && !docObj['swagger']) {
    throw new Error('Invalid OpenAPI document: missing openapi or swagger version field');
  }

  if (!docObj['paths']) {
    throw new Error('Invalid OpenAPI document: missing paths field');
  }
}
