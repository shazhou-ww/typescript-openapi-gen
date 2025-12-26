import { isSSEOperation } from '../openapi-parser.js'
import { buildFileHeader, capitalize } from '../shared/codegen-utils.js'
import type { RouteInfo, GenerationResult } from './types.js'
import { getRelativePathToTypes } from './utils.js'
import { writeGeneratedFile, getOutputTypeName } from './file-utils.js'
import {
  generateSeparateInputTypes,
  getBodySchema,
} from './zod-input-generator.js'
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
  lines.push("import { z } from 'zod'")
  lines.push('')
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
  const op = operation as import('../shared/openapi-types.js').OperationObject

  // Generate separate input types and schemas
  const { types, schemas, inputType } = generateSeparateInputTypes(op, routePath, methodName)

  // Add separate type definitions
  types.forEach(typeDef => {
    lines.push(typeDef)
    lines.push('')
  })

  // Add schema definitions
  schemas.forEach(schemaDef => {
    lines.push(schemaDef)
    lines.push('')
  })

  // Generate input type inferred from schemas
  const schemaRefs: string[] = []
  if (types.some(t => t.includes('Params'))) schemaRefs.push('params')
  if (types.some(t => t.includes('Query'))) schemaRefs.push('query')
  if (types.some(t => t.includes('Headers'))) schemaRefs.push('headers')
  if (types.some(t => t.includes('Body'))) schemaRefs.push('body')

  if (schemaRefs.length > 0) {
    // Create input type based on available schemas
    const inputProps = schemaRefs.map(ref => {
      const typeName = `${methodName}${ref.charAt(0).toUpperCase() + ref.slice(1)}`
      return `  ${ref}: ${typeName}`
    }).join('\n')
    lines.push(`export interface ${methodName}Input {`)
    lines.push(inputProps)
    lines.push('}')
    lines.push('')

    // Generate combined input schema for validation
    const schemaProps = schemaRefs.map(ref => {
      const schemaName = `${methodName}${ref.charAt(0).toUpperCase() + ref.slice(1)}Schema`
      if (ref === 'body') {
        // Body schema is validated separately
        return `  ${ref}: z.unknown()`
      }
      return `  ${ref}: ${schemaName}`
    }).join(',\n')
    lines.push(`export const ${methodName}InputSchema = z.object({`)
    lines.push(schemaProps)
    lines.push('})')
    lines.push('')
  } else {
    lines.push(`export type ${methodName}Input = {}`)
    lines.push(`export const ${methodName}InputSchema = z.object({})`)
    lines.push('')
  }

  // Generate output type
  lines.push(
    `export type ${outputTypeName} = ${generateOutputType(op, isSSE)}`,
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
    const typeImports = Array.from(referencedTypes).join(', ')
    const schemaImports = Array.from(referencedTypes)
      .map((t) => `${t}Schema`)
      .join(', ')
    lines.splice(3, 0, `import type { ${typeImports} } from '${relativePath}'`, '')
    lines.splice(4, 0, `import { ${schemaImports} } from '${relativePath}'`, '')
  }
}
