import { isReferenceObject } from '../openapi-parser'
import type {
  OperationObject,
  ParameterObject,
  RequestBodyObject,
  ResponseObject,
} from '../shared/openapi-types'
import { extractSchemaRefs } from '../type-generator/index'

/**
 * Collect all referenced type names from an operation
 */
export function collectReferencedTypes(
  operation: OperationObject,
  refs: Set<string>,
): void {
  collectFromParameters(operation, refs)
  collectFromRequestBody(operation, refs)
  collectFromResponses(operation, refs)
}

function collectFromParameters(
  operation: OperationObject,
  refs: Set<string>,
): void {
  for (const param of operation.parameters || []) {
    if (!isReferenceObject(param) && (param as ParameterObject).schema) {
      extractSchemaRefs((param as ParameterObject).schema, refs)
    }
  }
}

function collectFromRequestBody(
  operation: OperationObject,
  refs: Set<string>,
): void {
  if (!operation.requestBody || isReferenceObject(operation.requestBody)) return

  const content = (operation.requestBody as RequestBodyObject).content
  const jsonContent = content?.['application/json']
  if (jsonContent?.schema) {
    extractSchemaRefs(jsonContent.schema, refs)
  }
}

function collectFromResponses(
  operation: OperationObject,
  refs: Set<string>,
): void {
  for (const response of Object.values(operation.responses || {})) {
    if (isReferenceObject(response)) continue

    const content = (response as ResponseObject).content
    if (content?.['application/json']?.schema) {
      extractSchemaRefs(content['application/json'].schema, refs)
    }
    if (content?.['text/event-stream']?.schema) {
      extractSchemaRefs(content['text/event-stream'].schema, refs)
    }
  }
}
