import { isSSEOperation } from '../openapi-parser.js'
import { buildFileHeader, capitalize } from '../shared/codegen-utils.js'
import type { RouteInfo, GenerationResult } from './types.js'
import { writeGeneratedFile, getOutputTypeName } from './file-utils.js'
import { getBodySchema } from './zod-input-generator.js'

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

  // Import schemas
  lines.push("import type {")
  const typeImports: string[] = []
  const schemaImports: string[] = []
  for (const [method, operation] of info.methods) {
    const methodName = capitalize(method)
    const isSSE = isSSEOperation(operation)
    const outputTypeName = getOutputTypeName(methodName, isSSE)
    typeImports.push(`  ${methodName}Input, ${outputTypeName}`)
    schemaImports.push(`  ${methodName}InputSchema`)
    const bodySchema = getBodySchema(operation)
    if (bodySchema) {
      schemaImports.push(`  ${methodName}BodySchema`)
    }
  }
  lines.push(typeImports.join(',\n'))
  lines.push("} from './types.gen'")
  lines.push('')
  lines.push('import {')
  lines.push(schemaImports.join(',\n'))
  lines.push("} from './types.gen'")
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

    lines.push(`export ${functionKeyword} handle${methodName}(input: ${methodName}Input): ${returnType} {`)
    
    // Validate input (params, query, headers)
    lines.push(`  const validatedInput = ${methodName}InputSchema.parse(input)`)
    
    // Validate body separately if exists
    if (bodySchema) {
      lines.push(`  const validatedBody = ${methodName}BodySchema.parse(input.body)`)
      lines.push(`  const validated = { ...validatedInput, body: validatedBody }`)
      lines.push(`  return _handle${methodName}(validated as ${methodName}Input)`)
    } else {
      lines.push(`  return _handle${methodName}(validatedInput)`)
    }
    
    lines.push('}')
    lines.push('')
  }

  writeGeneratedFile(controllerDir, 'methods.gen.ts', lines, result)
}

