import type { OperationObject } from '../shared/openapi-types'

export interface GenerationResult {
  controllersGenerated: number
  filesCreated: number
  filesSkipped: number
  filesFormatted: number
  errors: string[]
  generatedFiles: string[]
}

export interface RouteInfo {
  path: string
  fsPath: string
  methods: Map<string, OperationObject>
  children: Map<string, RouteInfo>
}

export function createEmptyResult(): GenerationResult {
  return {
    controllersGenerated: 0,
    filesCreated: 0,
    filesSkipped: 0,
    filesFormatted: 0,
    errors: [],
    generatedFiles: [],
  }
}
