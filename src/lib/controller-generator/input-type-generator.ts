import { extractPathParams, isReferenceObject } from '../openapi-parser.js'
import { formatPropertyName } from '../shared/codegen-utils.js'
import type {
  OperationObject,
  ParameterObject,
  RequestBodyObject,
} from '../shared/openapi-types.js'
import { schemaToTypeScript } from '../type-generator/index.js'

/**
 * Generate input type for an operation
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

function addPathParams(properties: string[], routePath: string): void {
  const pathParams = extractPathParams(routePath)
  if (pathParams.length === 0) return

  const props = pathParams
    .map((p) => `    ${formatPropertyName(p)}: string`)
    .join('\n')
  properties.push(`  params: {\n${props}\n  }`)
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

function formatParam(param: ParameterObject): string {
  const optional = param.required ? '' : '?'
  const type = param.schema
    ? schemaToTypeScript(param.schema, '    ')
    : 'string'
  return `    ${formatPropertyName(param.name)}${optional}: ${type}`
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
    properties.push(`  body: ${schemaToTypeScript(jsonContent.schema, '  ')}`)
  }
}
