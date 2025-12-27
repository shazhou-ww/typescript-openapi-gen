import { isSSEOperation } from '../openapi-parser'
import { buildFileHeader, capitalize } from '../shared/codegen-utils'
import type { RouteInfo, GenerationResult } from './types'
import { writeGeneratedFile, getOutputTypeName } from './file-utils'
import { getBodySchema } from './zod-input-generator'

/**
 * Generate methods.gen.ts file with validation wrappers
 */
export function generateMethodsFile(
  controllerDir: string,
  info: RouteInfo,
  result: GenerationResult,
): void {
  if (info.methods.size === 0) return

  const lines = buildFileHeader('method wrappers with validation')
  lines.push("import { z } from 'zod'")
  lines.push('')

  // Import user-defined handlers
  for (const method of info.methods.keys()) {
    const methodName = capitalize(method)
    lines.push(`import { handle${methodName} as _handle${methodName} } from './${method}'`)
  }
  lines.push('')

  // Import types and schemas
  const typeImports: string[] = []
  const schemaImports: string[] = []
  for (const [method, operation] of info.methods) {
    const methodName = capitalize(method)
    const isSSE = isSSEOperation(operation)
    const outputTypeName = getOutputTypeName(methodName, isSSE)
    typeImports.push(outputTypeName)
    schemaImports.push(`${methodName}InputSchema`)
    const bodySchema = getBodySchema(operation)
    if (bodySchema) {
      schemaImports.push(`${methodName}BodySchema`)
    }
  }
  
  // Format type imports - use single line if short enough, multi-line otherwise
  // This matches prettier's formatting behavior
  const typeImportsStr = typeImports.join(', ')
  if (typeImportsStr.length <= 60) {
    // Single line if it fits (leaving room for "import type { ... } from './types.gen'")
    lines.push(`import type { ${typeImportsStr} } from './types.gen'`)
  } else {
    lines.push("import type {")
    lines.push(typeImports.map(t => `  ${t}`).join(',\n'))
    lines.push("} from './types.gen'")
  }
  lines.push('')
  
  // Format schema imports - use single line if short enough, multi-line otherwise
  const schemaImportsStr = schemaImports.join(', ')
  if (schemaImportsStr.length <= 60) {
    // Single line if it fits (leaving room for "import { ... } from './types.gen'")
    lines.push(`import { ${schemaImportsStr} } from './types.gen'`)
  } else {
    lines.push('import {')
    lines.push(schemaImports.map(s => `  ${s}`).join(',\n'))
    lines.push("} from './types.gen'")
  }
  lines.push('')

  // Generate wrapper functions
  for (const [method, operation] of info.methods) {
    const methodName = capitalize(method)
    const isSSE = isSSEOperation(operation)
    const outputTypeName = getOutputTypeName(methodName, isSSE)
    const returnType = isSSE
      ? `AsyncGenerator<${outputTypeName}>`
      : `Promise<${outputTypeName}>`
    const functionKeyword = isSSE ? 'async function*' : 'async function'
    const bodySchema = getBodySchema(operation)

    lines.push(`export ${functionKeyword} handle${methodName}(input: unknown): ${returnType} {`)

    // Validate input (params, query, headers)
    lines.push(`  const validatedInput = ${methodName}InputSchema.parse(input)`)

    // Validate body separately if exists
    if (bodySchema) {
      lines.push(`  const inputObj = input as any`)
      lines.push(`  const validatedBody = ${methodName}BodySchema.parse(inputObj.body)`)
      lines.push(`  const validated = { ...validatedInput, body: validatedBody }`)
      lines.push(`  return _handle${methodName}(validated)`)
    } else {
      lines.push(`  return _handle${methodName}(validatedInput)`)
    }
    
    lines.push('}')
    lines.push('')
  }

  writeGeneratedFile(controllerDir, 'methods.gen.ts', lines, result)
}

