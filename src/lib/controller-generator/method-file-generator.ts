import * as fs from 'node:fs'
import * as path from 'node:path'
import { isSSEOperation } from '../openapi-parser.js'
import { capitalize } from '../shared/codegen-utils.js'
import type { GenerationResult } from './types.js'
import { writeGeneratedFile, getOutputTypeName } from './file-utils.js'

/**
 * Generate method handler file (e.g., get.ts, post.ts)
 */
export function generateMethodFile(
  controllerDir: string,
  method: string,
  operation: object,
  result: GenerationResult,
): void {
  const methodName = capitalize(method)
  const isSSE = isSSEOperation(operation)
  const outputTypeName = getOutputTypeName(methodName, isSSE)

  const returnType = isSSE
    ? `AsyncGenerator<${outputTypeName}>`
    : `Promise<${outputTypeName}>`
  const functionKeyword = isSSE ? 'async function*' : 'async function'

  const lines: string[] = [
    `import type { ${methodName}Input, ${outputTypeName} } from './types'`,
    '',
    `export ${functionKeyword} handle${methodName}(input: ${methodName}Input): ${returnType} {`,
    '  // @ts-ignore - Implementation required',
    "  throw new Error('Not implemented')",
    '}',
    '',
  ]

  writeGeneratedFile(controllerDir, `${method}.ts`, lines, result)
}

/**
 * Generate method file only if it doesn't exist
 */
export function generateMethodFileIfNotExists(
  controllerDir: string,
  method: string,
  operation: object,
  result: GenerationResult,
): void {
  const methodPath = path.join(controllerDir, `${method}.ts`)
  if (fs.existsSync(methodPath)) {
    result.filesSkipped++
  } else {
    generateMethodFile(controllerDir, method, operation, result)
  }
}
