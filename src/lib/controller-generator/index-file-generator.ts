import { isSSEOperation } from '../openapi-parser.js'
import { buildFileHeader, capitalize } from '../shared/codegen-utils.js'
import type { RouteInfo, GenerationResult } from './types.js'
import { segmentToFsName } from './utils.js'
import { writeGeneratedFile, getOutputTypeName } from './file-utils.js'

/**
 * Generate index.ts file with re-exports
 */
export function generateIndexFile(
  controllerDir: string,
  info: RouteInfo,
  result: GenerationResult
): void {
  const lines = buildFileHeader('index file')

  addTypeExports(lines, info)
  addMethodExports(lines, info)
  addChildRouteExports(lines, info)
  lines.push('')

  writeGeneratedFile(controllerDir, 'index.ts', lines, result)
}

function addTypeExports(lines: string[], info: RouteInfo): void {
  if (info.methods.size === 0) return

  const typeExports: string[] = []
  for (const [method, operation] of info.methods) {
    const methodName = capitalize(method)
    typeExports.push(`${methodName}Input`)
    typeExports.push(getOutputTypeName(methodName, isSSEOperation(operation)))
  }

  lines.push(`export type { ${typeExports.join(', ')} } from './types.js'`)
  lines.push('')
}

function addMethodExports(lines: string[], info: RouteInfo): void {
  for (const method of info.methods.keys()) {
    lines.push(`export { handle${capitalize(method)} } from './${method}.js'`)
  }

  if (info.methods.size > 0 && info.children.size > 0) {
    lines.push('')
  }
}

function addChildRouteExports(lines: string[], info: RouteInfo): void {
  for (const [childSegment] of info.children) {
    const fsName = segmentToFsName(childSegment)
    lines.push(`export * as ${fsName} from './${fsName}/index.js'`)
  }
}
