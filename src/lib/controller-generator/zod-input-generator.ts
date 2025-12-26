import { extractPathParams, isReferenceObject } from '../openapi-parser.js'
import { formatPropertyName } from '../shared/codegen-utils.js'
import type {
  OperationObject,
  ParameterObject,
  RequestBodyObject,
} from '../shared/openapi-types.js'
import { schemaToZod } from '../type-generator/zod-schema-converter.js'
import { schemaToTypeScript } from '../type-generator/schema-converter.js'

/**
 * Generate separate input type definitions and schemas
 * Returns an object with type definitions and schema definitions
 */
export function generateSeparateInputTypes(
  operation: OperationObject,
  routePath: string,
  methodName: string,
): { types: string[]; schemas: string[]; inputType: string } {
  const types: string[] = []
  const schemas: string[] = []
  const inputParts: string[] = []

  // Generate params type/schema
  const paramsType = generateParamsType(routePath)
  if (paramsType) {
    types.push(`export interface ${methodName}Params ${paramsType}`)
    schemas.push(`export const ${methodName}ParamsSchema = ${generateParamsZodSchema(routePath)}`)
    inputParts.push('params')
  }

  // Generate query type/schema
  const queryType = generateDirectParameterGroupType(operation, 'query')
  if (queryType) {
    types.push(`export interface ${methodName}Query ${queryType}`)
    schemas.push(`export const ${methodName}QuerySchema = ${generateDirectParameterGroupZodSchema(operation, 'query')}`)
    inputParts.push('query')
  }

  // Generate headers type/schema
  const headersType = generateDirectParameterGroupType(operation, 'header')
  if (headersType) {
    types.push(`export interface ${methodName}Headers ${headersType}`)
    schemas.push(`export const ${methodName}HeadersSchema = ${generateDirectParameterGroupZodSchema(operation, 'header')}`)
    inputParts.push('headers')
  }

  // Generate body type/schema
  const bodySchema = getBodySchema(operation)
  if (bodySchema) {
    // For body, we create a type based on the schema
    // The body will be validated in methods.gen.ts
    types.push(`export type ${methodName}Body = unknown`)  // Will be inferred from schema
    schemas.push(`export const ${methodName}BodySchema = ${bodySchema}`)
    inputParts.push('body')
  }

  // Generate input type based on available parts
  let inputType = '{}'
  if (inputParts.length > 0) {
    const inputProperties = inputParts.map(part => {
      if (part === 'params') return `  params: ${methodName}Params`
      if (part === 'query') return `  query: ${methodName}Query`
      if (part === 'headers') return `  headers: ${methodName}Headers`
      if (part === 'body') return `  body: ${methodName}Body`
      return ''
    }).filter(Boolean)
    inputType = `{\n${inputProperties.join('\n')}\n}`
  }

  return { types, schemas, inputType }
}

/**
 * Generate params type for path parameters
 */
function generateParamsType(routePath: string): string | null {
  const properties: string[] = []
  addPathParams(properties, routePath)
  if (properties.length === 0) return null
  return `{\n${properties.join('\n')}\n}`
}

/**
 * Generate params Zod schema for path parameters
 */
function generateParamsZodSchema(routePath: string): string {
  const properties: string[] = []
  addPathParamsZod(properties, routePath)
  if (properties.length === 0) return 'z.object({})'
  return `z.object({\n${properties.join(',\n')}\n})`
}

/**
 * Generate parameter group type (query or header)
 */
function generateParameterGroupType(
  operation: OperationObject,
  paramType: 'query' | 'header',
): string | null {
  const properties: string[] = []
  const paramName = paramType === 'header' ? 'headers' : paramType
  addParameterGroup(properties, operation, paramType, paramName)
  if (properties.length === 0) return null
  return `{\n${properties.join('\n')}\n}`
}

/**
 * Generate direct parameter group type (without wrapper object)
 */
function generateDirectParameterGroupType(
  operation: OperationObject,
  paramType: 'query' | 'header',
): string | null {
  const properties: string[] = []
  addDirectParameterGroup(properties, operation, paramType)
  if (properties.length === 0) return null
  return `{\n${properties.join('\n')}\n}`
}

/**
 * Generate parameter group Zod schema (query or header)
 */
function generateParameterGroupZodSchema(
  operation: OperationObject,
  paramType: 'query' | 'header',
): string {
  const properties: string[] = []
  const paramName = paramType === 'header' ? 'headers' : paramType
  addParameterGroupZod(properties, operation, paramType, paramName)
  if (properties.length === 0) return 'z.object({})'
  return `z.object({\n${properties.join(',\n')}\n})`
}

/**
 * Generate direct parameter group Zod schema (without wrapper object)
 */
function generateDirectParameterGroupZodSchema(
  operation: OperationObject,
  paramType: 'query' | 'header',
): string {
  const properties: string[] = []
  addDirectParameterGroupZod(properties, operation, paramType)
  if (properties.length === 0) return 'z.object({})'
  return `z.object({\n${properties.join(',\n')}\n})`
}

function addPathParamsZod(properties: string[], routePath: string): void {
  const pathParams = extractPathParams(routePath)
  if (pathParams.length === 0) return

  const props = pathParams
    .map((p) => `    ${formatPropertyName(p)}: z.string()`)
    .join(',\n')
  properties.push(`  params: z.object({\n${props}\n  })`)
}

function addPathParams(properties: string[], routePath: string): void {
  const pathParams = extractPathParams(routePath)
  if (pathParams.length === 0) return

  const props = pathParams
    .map((p) => `    ${formatPropertyName(p)}: string`)
    .join('\n')
  properties.push(`  params: {\n${props}\n  }`)
}

function addParameterGroupZod(
  properties: string[],
  operation: OperationObject,
  location: 'query' | 'header',
  propName?: string,
): void {
  const params = (operation.parameters || []).filter(
    (p): p is ParameterObject => !isReferenceObject(p) && p.in === location,
  )

  if (params.length === 0) return

  const props = params.map(formatParamZod).join(',\n')
  properties.push(`  ${propName || location}: z.object({\n${props}\n  })`)
}

function addDirectParameterGroupZod(
  properties: string[],
  operation: OperationObject,
  location: 'query' | 'header',
): void {
  const params = (operation.parameters || []).filter(
    (p): p is ParameterObject => !isReferenceObject(p) && p.in === location,
  )

  if (params.length === 0) return

  params.forEach(param => {
    properties.push(formatParamZod(param))
  })
}

function addParameterGroup(
  properties: string[],
  operation: OperationObject,
  location: 'query' | 'header',
  propName?: string,
): void {
  const params = (operation.parameters || []).filter(
    (p): p is ParameterObject => !isReferenceObject(p) && p.in === location,
  )

  if (params.length === 0) return

  const props = params.map(formatParam).join('\n')
  properties.push(`  ${propName || location}: {\n${props}\n  }`)
}

function addDirectParameterGroup(
  properties: string[],
  operation: OperationObject,
  location: 'query' | 'header',
): void {
  const params = (operation.parameters || []).filter(
    (p): p is ParameterObject => !isReferenceObject(p) && p.in === location,
  )

  if (params.length === 0) return

  const props = params.map(formatParam).join('\n')
  properties.push(...props.split('\n').map(line => line.replace(/^  /, '')))
}

function formatParamZod(param: ParameterObject): string {
  const zodSchema = param.schema
    ? schemaToZod(param.schema, '    ')
    : 'z.string()'
  const optional = param.required ? '' : '.optional()'
  return `    ${formatPropertyName(param.name)}: ${zodSchema}${optional}`
}

function formatParam(param: ParameterObject): string {
  const optional = param.required ? '' : '?'
  const type = param.schema
    ? schemaToTypeScript(param.schema, '    ')
    : 'string'
  return `    ${formatPropertyName(param.name)}${optional}: ${type}`
}

function addRequestBodyZod(
  properties: string[],
  operation: OperationObject,
): void {
  if (!operation.requestBody || isReferenceObject(operation.requestBody)) return

  const jsonContent = (operation.requestBody as RequestBodyObject).content?.[
    'application/json'
  ]
  if (jsonContent?.schema) {
    // Body is validated separately, so we use unknown in the schema
    // The actual body schema will be stored separately for validation
    properties.push(`  body: z.unknown()`)
  }
}

function addRequestBody(
  properties: string[],
  operation: OperationObject,
): void {
  if (!operation.requestBody || isReferenceObject(operation.requestBody)) return

  const jsonContent = (operation.requestBody as RequestBodyObject).content?.[
    'application/json'
  ]
  if (jsonContent?.schema) {
    // Body is unknown - will be validated in methods.gen.ts
    properties.push(`  body: unknown`)
  }
}

/**
 * Get body schema for separate validation
 */
export function getBodySchema(
  operation: OperationObject,
): string | undefined {
  if (!operation.requestBody || isReferenceObject(operation.requestBody)) {
    return undefined
  }

  const jsonContent = (operation.requestBody as RequestBodyObject).content?.[
    'application/json'
  ]
  if (jsonContent?.schema) {
    return schemaToZod(jsonContent.schema, '')
  }
  return undefined
}

