import type { OperationObject } from '../shared/openapi-types.js'

export interface GenerationResult {
  controllersGenerated: number
  filesCreated: number
  filesSkipped: number
  errors: string[]
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
    errors: [],
  }
}
