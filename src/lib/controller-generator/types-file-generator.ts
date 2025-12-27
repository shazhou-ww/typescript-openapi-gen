import { isSSEOperation } from '../openapi-parser'
import { buildFileHeader, capitalize } from '../shared/codegen-utils'
import type { RouteInfo, GenerationResult } from './types'
import { getRelativePathToTypes } from './utils'
import { writeGeneratedFile, getOutputTypeName } from './file-utils'
import {
  generateSeparateInputTypes,
  getBodySchema,
} from './zod-input-generator'
import { generateOutputType } from './output-type-generator'
import { collectReferencedTypes } from './refs-collector'

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
    const typeImports = Array.from(referencedTypes).sort()
    const schemaImports = Array.from(referencedTypes)
      .map((t) => `${t}Schema`)
      .sort()
    
    // Format type imports - single line if only one, multi-line if multiple
    // Insert before "import { z } from 'zod'" which is at index 3
    const importLines: string[] = []
    if (typeImports.length === 1) {
      // Single line format for single import
      importLines.push(`import type { ${typeImports[0]} } from '${relativePath}'`)
    } else {
      // Multi-line format for multiple imports
      importLines.push("import type {")
      typeImports.forEach((t) => {
        // Add trailing comma for all items (prettier will format based on trailingComma config)
        importLines.push(`  ${t},`)
      })
      importLines.push(`} from '${relativePath}'`)
    }
    
    // Format schema imports - single line if only one, multi-line if multiple
    if (schemaImports.length === 1) {
      // Single line format for single import
      importLines.push(`import { ${schemaImports[0]} } from '${relativePath}'`)
    } else {
      // Multi-line format for multiple imports
      importLines.push('import {')
      schemaImports.forEach((s) => {
        // Add trailing comma for all items (prettier will format based on trailingComma config)
        importLines.push(`  ${s},`)
      })
      importLines.push(`} from '${relativePath}'`)
    }
    // Add empty line after all imports, before "import { z } from 'zod'"
    importLines.push('')
    
    // Insert all import lines before "import { z } from 'zod'"
    lines.splice(3, 0, ...importLines)
  }
}
