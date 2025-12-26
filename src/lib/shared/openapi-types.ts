import type { OpenAPIV3, OpenAPIV3_1 } from 'openapi-types'

// Shared OpenAPI type aliases
export type SchemaObject = OpenAPIV3.SchemaObject | OpenAPIV3_1.SchemaObject
export type ReferenceObject = OpenAPIV3.ReferenceObject | OpenAPIV3_1.ReferenceObject
export type OperationObject = OpenAPIV3.OperationObject | OpenAPIV3_1.OperationObject
export type ParameterObject = OpenAPIV3.ParameterObject | OpenAPIV3_1.ParameterObject
export type RequestBodyObject = OpenAPIV3.RequestBodyObject | OpenAPIV3_1.RequestBodyObject
export type ResponseObject = OpenAPIV3.ResponseObject | OpenAPIV3_1.ResponseObject
export type PathItemObject = OpenAPIV3.PathItemObject | OpenAPIV3_1.PathItemObject

