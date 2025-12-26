import { isSSEOperation } from '../openapi-parser.js'
import { buildFileHeader, capitalize } from '../shared/codegen-utils.js'
import type { RouteInfo, GenerationResult } from './types.js'
import { getRelativePathToTypes } from './utils.js'
import { writeGeneratedFile, getOutputTypeName } from './file-utils.js'
import { generateInputType } from './input-type-generator.js'
import { generateOutputType } from './output-type-generator.js'
import { collectReferencedTypes } from './refs-collector.js'

/**
 * Generate types.ts file for a controller
 */
export function generateTypesFile(
  controllerDir: string,
  info: RouteInfo,
  sharedTypesDir: string,
  result: GenerationResult,
): void {
  const lines = buildFileHeader('types from OpenAPI specification')
  const referencedTypes = new Set<string>()

  for (const [method, operation] of info.methods) {
    addMethodTypes(lines, method, operation, info.path, referencedTypes)
  }

  addImportIfNeeded(lines, referencedTypes, controllerDir, sharedTypesDir)
  writeGeneratedFile(controllerDir, 'types.gen.ts', lines, result)
}

function addMethodTypes(
  lines: string[],
  method: string,
  operation: object,
  routePath: string,
  referencedTypes: Set<string>,
): void {
  const methodName = capitalize(method)
  const isSSE = isSSEOperation(operation)
  const outputTypeName = getOutputTypeName(methodName, isSSE)

  lines.push(
    `export interface ${methodName}Input ${generateInputType(operation, routePath)}`,
  )
  lines.push('')
  lines.push(
    `export type ${outputTypeName} = ${generateOutputType(operation, isSSE)}`,
  )
  lines.push('')

  collectReferencedTypes(operation, referencedTypes)
}

function addImportIfNeeded(
  lines: string[],
  referencedTypes: Set<string>,
  controllerDir: string,
  sharedTypesDir: string,
): void {
  if (referencedTypes.size > 0) {
    const relativePath = getRelativePathToTypes(controllerDir, sharedTypesDir)
    const imports = Array.from(referencedTypes).join(', ')
    lines.splice(3, 0, `import type { ${imports} } from '${relativePath}'`, '')
  }
}
