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
 * Generate Zod schema for input validation
 * Body is validated separately, so we mark it as unknown in the schema
 */
export function generateInputZodSchema(
  operation: OperationObject,
  routePath: string,
): string {
  const properties: string[] = []

  addPathParamsZod(properties, routePath)
  addParameterGroupZod(properties, operation, 'query')
  addParameterGroupZod(properties, operation, 'header', 'headers')
  addRequestBodyZod(properties, operation)

  if (properties.length === 0) return 'z.object({})'
  return `z.object({\n${properties.join(',\n')}\n})`
}

/**
 * Generate TypeScript input type
 * Body is unknown - will be validated in methods.gen.ts
 */
export function generateInputType(
  operation: OperationObject,
  routePath: string,
): string {
  const properties: string[] = []

  addPathParams(properties, routePath)
  addParameterGroup(properties, operation, 'query')
  addParameterGroup(properties, operation, 'header', 'headers')
  addRequestBody(properties, operation)

  if (properties.length === 0) return '{}'
  return `{\n${properties.join('\n')}\n}`
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

