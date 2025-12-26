import * as fs from 'node:fs'
import * as path from 'node:path'
import type { SchemaObject, ReferenceObject } from '../shared/openapi-types.js'
import { generateSharedTypes } from '../type-generator/index.js'
import type { GenerationResult } from './types.js'

/**
 * Generate the shared types folder with separate files per type
 */
export function generateSharedTypesFolder(
  sharedTypesDir: string,
  schemas: Record<string, SchemaObject | ReferenceObject> | undefined,
  result: GenerationResult,
): void {
  fs.mkdirSync(sharedTypesDir, { recursive: true })

  const { files, indexContent } = generateSharedTypes(schemas)

  // Write individual type files
  for (const file of files) {
    const filePath = path.join(sharedTypesDir, `${file.name}.gen.ts`)
    fs.writeFileSync(filePath, file.content)
    result.filesCreated++
    result.generatedFiles.push(filePath)
  }

  // Write index file
  const indexPath = path.join(sharedTypesDir, 'index.ts')
  fs.writeFileSync(indexPath, indexContent)
  result.filesCreated++
  result.generatedFiles.push(indexPath)
}
