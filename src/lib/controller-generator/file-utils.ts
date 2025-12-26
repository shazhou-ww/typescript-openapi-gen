import * as fs from 'node:fs'
import * as path from 'node:path'
import type { GenerationResult } from './types.js'

/**
 * Write file and increment result counter
 * Also tracks the file path for later formatting
 */
export function writeGeneratedFile(
  dir: string,
  filename: string,
  lines: string[],
  result: GenerationResult,
): void {
  const filePath = path.join(dir, filename)
  fs.writeFileSync(filePath, lines.join('\n'))
  result.filesCreated++
  result.generatedFiles.push(filePath)
}

/**
 * Get output type name based on whether operation supports SSE
 */
export function getOutputTypeName(methodName: string, isSSE: boolean): string {
  return isSSE ? `${methodName}EventOutput` : `${methodName}Output`
}
