import type { OpenAPIV3, OpenAPIV3_1 } from 'openapi-types';

// Shared OpenAPI type aliases
export type SchemaObject = OpenAPIV3.SchemaObject | OpenAPIV3_1.SchemaObject;
export type ReferenceObject =
  | OpenAPIV3.ReferenceObject
  | OpenAPIV3_1.ReferenceObject;
export type OperationObject =
  | OpenAPIV3.OperationObject
  | OpenAPIV3_1.OperationObject;
export type ParameterObject =
  | OpenAPIV3.ParameterObject
  | OpenAPIV3_1.ParameterObject;
export type RequestBodyObject =
  | OpenAPIV3.RequestBodyObject
  | OpenAPIV3_1.RequestBodyObject;
export type ResponseObject =
  | OpenAPIV3.ResponseObject
  | OpenAPIV3_1.ResponseObject;
export type PathItemObject =
  | OpenAPIV3.PathItemObject
  | OpenAPIV3_1.PathItemObject;

/**
 * OpenAPI Document 类型
 */
export type OpenApiDocument = (OpenAPIV3.Document | OpenAPIV3_1.Document) & {
  swagger?: string; // Swagger 2.0 compatibility
};

/**
 * Intermediate Representation (IR)
 * 这是对 OpenAPI Document 的内部表示
 */
export interface IR {
  document: OpenApiDocument;
  // 可以在这里添加更多预处理的数据结构
  paths: Map<string, PathItemObject>;
  schemas: Map<string, SchemaObject>;
  operations: OperationObject[];
}
