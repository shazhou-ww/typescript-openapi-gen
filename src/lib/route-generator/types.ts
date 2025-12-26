import type { OperationObject } from '../shared/openapi-types.js'

export interface RouteGenerationResult {
  routesGenerated: number
  fileCreated: boolean
  fileFormatted: boolean
  errors: string[]
}

export interface FlatRoute {
  path: string // Original OpenAPI path, e.g., "/pets/{petId}"
  elysiaPath: string // Elysia path format, e.g., "/pets/:petId"
  method: string // HTTP method
  operation: OperationObject
  controllerImportPath: string[] // Path segments for controller import, e.g., ["pets", "_petId"]
  handlerName: string // Handler function name, e.g., "handleGet"
  returnType: string // Return type, e.g., "Pet", "void"
}

export function createEmptyResult(): RouteGenerationResult {
  return {
    routesGenerated: 0,
    fileCreated: false,
    fileFormatted: false,
    errors: [],
  }
}
