import { isReferenceObject } from '../openapi-parser.js'
import type { OperationObject, ResponseObject } from '../shared/openapi-types.js'
import { schemaToTypeScript } from '../type-generator/index.js'

/**
 * Generate output type for an operation
 */
export function generateOutputType(operation: OperationObject, isSSE: boolean): string {
  const responses = operation.responses
  if (!responses) return 'void'

  const successResponse = responses['200'] || responses['201'] || responses['default']
  if (!successResponse) return 'void'

  if (isReferenceObject(successResponse)) return 'unknown'

  const response = successResponse as ResponseObject
  const content = response.content

  if (isSSE && content?.['text/event-stream']?.schema) {
    return schemaToTypeScript(content['text/event-stream'].schema, '')
  }

  if (content?.['application/json']?.schema) {
    return schemaToTypeScript(content['application/json'].schema, '')
  }

  return 'void'
}

