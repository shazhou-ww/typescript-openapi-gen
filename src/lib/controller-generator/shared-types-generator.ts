import * as fs from 'node:fs'
import * as path from 'node:path'
import type { SchemaObject, ReferenceObject } from '../shared/openapi-types.js'
import { generateSharedTypes } from '../type-generator/index.js'
import type { GenerationResult } from './types.js'

/**
 * Generate the shared types folder
 */
export function generateSharedTypesFolder(
  sharedTypesDir: string,
  schemas: Record<string, SchemaObject | ReferenceObject> | undefined,
  result: GenerationResult,
): void {
  fs.mkdirSync(sharedTypesDir, { recursive: true })

  const content = generateSharedTypes(schemas)
  fs.writeFileSync(path.join(sharedTypesDir, 'index.ts'), content)
  result.filesCreated++
}
