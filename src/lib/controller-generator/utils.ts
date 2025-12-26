import * as path from 'node:path'
import { capitalize } from '../shared/codegen-utils.js'
import type { RouteInfo } from './types.js'

/**
 * Get relative path from controller directory to types folder
 */
export function getRelativePathToTypes(controllerDir: string, outputDir: string): string {
  const relativePath = path.relative(controllerDir, path.join(outputDir, 'types'))
  return relativePath.split(path.sep).join('/') + '/index.js'
}

/**
 * Convert route segment to filesystem name
 */
export function segmentToFsName(segment: string): string {
  const match = segment.match(/^\{(.+)\}$/)
  return match ? `_${match[1]}` : segment
}

/**
 * Check for naming conflicts between child routes and method handlers
 */
export function checkForNamingConflicts(info: RouteInfo): boolean {
  const handlerNames = new Set<string>()
  for (const method of info.methods.keys()) {
    handlerNames.add(`handle${capitalize(method)}`)
  }

  for (const [childSegment] of info.children) {
    const fsName = segmentToFsName(childSegment)
    if (handlerNames.has(fsName)) {
      return true
    }
  }

  return false
}
