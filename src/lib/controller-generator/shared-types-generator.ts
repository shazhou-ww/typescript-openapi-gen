import * as fs from 'node:fs'
import * as path from 'node:path'
import type { SchemaObject, ReferenceObject } from '../shared/openapi-types.js'
import { generateSharedTypes } from '../type-generator/index.js'
import type { GenerationResult } from './types.js'

/**
 * Generate the shared types folder
 */
export function generateSharedTypesFolder(
  outputDir: string,
  schemas: Record<string, SchemaObject | ReferenceObject> | undefined,
  result: GenerationResult
): void {
  const typesDir = path.join(outputDir, 'types')
  fs.mkdirSync(typesDir, { recursive: true })

  const content = generateSharedTypes(schemas)
  fs.writeFileSync(path.join(typesDir, 'index.ts'), content)
  result.filesCreated++
}
