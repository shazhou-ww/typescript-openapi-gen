/**
 * OpenApiConverter: OpenAPI 格式转换相关的工具函数集合
 * 
 * 职责边界：
 * - 应该包含：所有与 OpenAPI 格式转换相关的工具函数（将 OpenApiDocument 转换为标准 OpenAPI 格式）
 * - 不应该包含：文件写入、路径计算、字符串操作等其他领域的工具函数
 * 
 * 导出: OpenApiConverter 对象
 */

import type { OpenApiDocument, PathItem, Operation, Method, JSONSchema, Ref } from '../../types';

export const OpenApiConverter = {
  toOpenApiFormat(doc: OpenApiDocument): Record<string, unknown> {
    return {
      openapi: '3.0.0',
      info: { title: 'Generated API', version: '1.0.0' },
      paths: convertPaths(doc.paths),
      components: { schemas: convertSchemas(doc.types) },
    };
  },

  toPathItem(pathItem: PathItem, externalSchemaRef?: string): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    
    if (pathItem.description) {
      result.description = pathItem.description;
    }
    if (pathItem.summary) {
      result.summary = pathItem.summary;
    }

    const parameters = convertParameters(pathItem.parameters, 'path', externalSchemaRef);
    if (parameters.length > 0) {
      result.parameters = parameters;
    }

    const operations: Record<string, unknown> = {};
    for (const [method, operation] of Object.entries(pathItem.operations)) {
      if (operation) {
        operations[method] = convertOperation(operation, pathItem.parameters, externalSchemaRef);
      }
    }
    if (Object.keys(operations).length > 0) {
      Object.assign(result, operations);
    }

    return result;
  },

  toSchema(schema: JSONSchema | Ref, externalSchemaRef?: string): unknown {
    if ('$ref' in schema) {
      if (externalSchemaRef) {
        return { $ref: `${externalSchemaRef}#/components/schemas/${schema.$ref}` };
      }
      return { $ref: `#/components/schemas/${schema.$ref}` };
    }
    return convertJsonSchema(schema, externalSchemaRef);
  },
};

function convertPaths(paths: Record<string, PathItem>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [path, pathItem] of Object.entries(paths)) {
    result[path] = OpenApiConverter.toPathItem(pathItem);
  }
  return result;
}

function convertSchemas(schemas: Record<string, JSONSchema>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [name, schema] of Object.entries(schemas)) {
    result[name] = convertJsonSchema(schema);
  }
  return result;
}

function convertOperation(operation: Operation, pathParams: Record<string, JSONSchema | Ref>, externalSchemaRef?: string): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  
  if (operation.operationId) {
    result.operationId = operation.operationId;
  }
  if (operation.summary) {
    result.summary = operation.summary;
  }
  if (operation.description) {
    result.description = operation.description;
  }
  if (operation.deprecated) {
    result.deprecated = true;
  }
  if (operation.tags.length > 0) {
    result.tags = operation.tags;
  }

  const parameters = [
    ...convertParameters(pathParams, 'path', externalSchemaRef),
    ...convertParameters(operation.query, 'query', externalSchemaRef),
    ...convertParameters(operation.headers, 'header', externalSchemaRef),
    ...convertParameters(operation.cookie, 'cookie', externalSchemaRef),
  ];
  if (parameters.length > 0) {
    result.parameters = parameters;
  }

  if (operation.body) {
    result.requestBody = convertRequestBody(operation.body, externalSchemaRef);
  }

  if (Object.keys(operation.responses).length > 0) {
    result.responses = convertResponses(operation.responses, externalSchemaRef);
  }

  return result;
}

function convertParameters(params: Record<string, JSONSchema | Ref>, location: string, externalSchemaRef?: string): unknown[] {
  return Object.entries(params).map(([name, schema]) => ({
    name,
    in: location,
    schema: OpenApiConverter.toSchema(schema, externalSchemaRef),
  }));
}

function convertRequestBody(body: JSONSchema | Ref, externalSchemaRef?: string): Record<string, unknown> {
  return {
    content: {
      'application/json': {
        schema: OpenApiConverter.toSchema(body, externalSchemaRef),
      },
    },
  };
}

function convertResponses(responses: Record<string, import('../../types').ResponseItem>, externalSchemaRef?: string): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [status, response] of Object.entries(responses)) {
    result[status] = convertResponseItem(response, externalSchemaRef);
  }
  return result;
}

function convertResponseItem(response: import('../../types').ResponseItem, externalSchemaRef?: string): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  
  if (response.description) {
    result.description = response.description;
  }
  if (response.summary) {
    result.summary = response.summary;
  }

  if (response.content) {
    result.content = {
      'application/json': {
        schema: OpenApiConverter.toSchema(response.content, externalSchemaRef),
      },
    };
  }

  if (Object.keys(response.headers).length > 0) {
    result.headers = convertParameters(response.headers, 'header', externalSchemaRef);
  }

  return result;
}

function convertJsonSchema(schema: JSONSchema, externalSchemaRef?: string): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  
  if (schema.type !== null) {
    result.type = schema.type;
  }
  if (schema.format) {
    result.format = schema.format;
  }
  if (schema.enum) {
    result.enum = schema.enum;
  }
  if (schema.const !== null) {
    result.const = schema.const;
  }
  if (schema.title) {
    result.title = schema.title;
  }
  if (schema.description) {
    result.description = schema.description;
  }
  if (schema.default !== null) {
    result.default = schema.default;
  }
  if (schema.examples) {
    result.examples = schema.examples;
  }
  if (schema.deprecated) {
    result.deprecated = true;
  }
  if (schema.nullable) {
    result.nullable = true;
  }

  // string constraints
  if (schema.minLength !== null) {
    result.minLength = schema.minLength;
  }
  if (schema.maxLength !== null) {
    result.maxLength = schema.maxLength;
  }
  if (schema.pattern) {
    result.pattern = schema.pattern;
  }

  // number constraints
  if (schema.minimum !== null) {
    result.minimum = schema.minimum;
  }
  if (schema.maximum !== null) {
    result.maximum = schema.maximum;
  }
  if (schema.exclusiveMinimum !== null) {
    result.exclusiveMinimum = schema.exclusiveMinimum;
  }
  if (schema.exclusiveMaximum !== null) {
    result.exclusiveMaximum = schema.exclusiveMaximum;
  }
  if (schema.multipleOf !== null) {
    result.multipleOf = schema.multipleOf;
  }

  // array constraints
  if (schema.items) {
    result.items = OpenApiConverter.toSchema(schema.items, externalSchemaRef);
  }
  if (schema.minItems !== null) {
    result.minItems = schema.minItems;
  }
  if (schema.maxItems !== null) {
    result.maxItems = schema.maxItems;
  }
  if (schema.uniqueItems) {
    result.uniqueItems = true;
  }

  // object constraints
  if (Object.keys(schema.properties).length > 0) {
    const props: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(schema.properties)) {
      props[key] = OpenApiConverter.toSchema(value, externalSchemaRef);
    }
    result.properties = props;
  }
  if (schema.required.length > 0) {
    result.required = schema.required;
  }
  if (schema.additionalProperties !== null) {
    if (typeof schema.additionalProperties === 'boolean') {
      result.additionalProperties = schema.additionalProperties;
    } else {
      result.additionalProperties = OpenApiConverter.toSchema(schema.additionalProperties, externalSchemaRef);
    }
  }

  // composition
  if (schema.allOf) {
    result.allOf = schema.allOf.map(s => OpenApiConverter.toSchema(s, externalSchemaRef));
  }
  if (schema.anyOf) {
    result.anyOf = schema.anyOf.map(s => OpenApiConverter.toSchema(s, externalSchemaRef));
  }
  if (schema.oneOf) {
    result.oneOf = schema.oneOf.map(s => OpenApiConverter.toSchema(s, externalSchemaRef));
  }
  if (schema.not) {
    result.not = OpenApiConverter.toSchema(schema.not, externalSchemaRef);
  }

  return result;
}

