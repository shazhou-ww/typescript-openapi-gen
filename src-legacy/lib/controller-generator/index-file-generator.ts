import { isSSEOperation } from '../openapi-parser'
import { buildFileHeader, capitalize } from '../shared/codegen-utils'
import type { RouteInfo, GenerationResult } from './types'
import { segmentToFsName } from './utils'
import { writeGeneratedFile, getOutputTypeName } from './file-utils'

/**
 * Generate index.ts file with re-exports
 */
export function generateIndexFile(
  controllerDir: string,
  info: RouteInfo,
  result: GenerationResult,
): void {
  const lines = buildFileHeader('index file')

  const hadTypeExports = addTypeExports(lines, info)
  const hadMethodExports = addMethodExports(lines, info)
  const hadChildExports = addChildRouteExports(lines, info)

  // Generate file if there are exports or if this is a routing node (has children)
  if (hadTypeExports || hadMethodExports || hadChildExports || info.children.size > 0) {
    lines.push('')
    writeGeneratedFile(controllerDir, 'index.ts', lines, result)
  }
}

/**
 * Generate root index.ts file that exports all top-level route modules
 */
export function generateRootIndexFile(
  outputDir: string,
  routeTree: Map<string, RouteInfo>,
  result: GenerationResult,
): void {
  const lines = buildFileHeader('index file')

  // Export all top-level route modules
  const segments = Array.from(routeTree.keys()).sort()

  for (const segment of segments) {
    const fsName = segmentToFsName(segment)
    // Use export * as syntax for valid identifiers, import/export for special chars
    if (/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(fsName)) {
      lines.push(`export * as ${fsName} from './${fsName}'`)
    } else {
      const exportName = fsName.replace(/[^a-zA-Z0-9_$]/g, '_')
      lines.push(`import * as ${exportName} from './${fsName}'`)
      lines.push(`export { ${exportName} }`)
    }
  }

  lines.push('')

  writeGeneratedFile(outputDir, 'index.ts', lines, result)
}

function addTypeExports(lines: string[], info: RouteInfo): boolean {
  if (info.methods.size === 0) return false

  const typeExports: string[] = []
  for (const [method, operation] of info.methods) {
    const methodName = capitalize(method)
    typeExports.push(`${methodName}Input`)
    typeExports.push(getOutputTypeName(methodName, isSSEOperation(operation)))
  }

  lines.push(`export type { ${typeExports.join(', ')} } from './types.gen'`)
  lines.push('')
  return true
}

function addMethodExports(lines: string[], info: RouteInfo): boolean {
  if (info.methods.size === 0) return false

  // Export from methods.gen.ts (with validation) instead of direct handlers
  for (const method of info.methods.keys()) {
    lines.push(`export { handle${capitalize(method)} } from './methods.gen'`)
  }

  if (info.children.size > 0) {
    lines.push('')
  }

  return true
}

function addChildRouteExports(lines: string[], info: RouteInfo): boolean {
  if (info.children.size === 0) return false

  for (const [childSegment] of info.children) {
    const fsName = segmentToFsName(childSegment)
    const exportName = fsName.replace(/[^a-zA-Z0-9_$]/g, '_')
    lines.push(`export * as ${exportName} from './${fsName}'`)
  }

  return true
}
