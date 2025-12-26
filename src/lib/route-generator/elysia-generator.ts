import * as fs from 'node:fs'
import * as path from 'node:path'
import type { OpenAPIDocument } from '../openapi-parser.js'
import { buildFileHeader } from '../shared/codegen-utils.js'
import { formatFileWithPrettier } from '../shared/formatter.js'
import type { FlatRoute, RouteGenerationResult } from './types.js'
import { createEmptyResult } from './types.js'
import { collectRoutes } from './route-collector.js'
import { extractPathParams } from '../openapi-parser.js'

export interface ElysiaRouteGeneratorOptions {
  prettierConfig?: string
}

export class ElysiaRouteGenerator {
  private doc: OpenAPIDocument
  private controllerPath: string
  private outputPath: string
  private options: ElysiaRouteGeneratorOptions
  private result: RouteGenerationResult = createEmptyResult()

  constructor(
    doc: OpenAPIDocument,
    controllerPath: string,
    outputPath: string,
    options: ElysiaRouteGeneratorOptions = {},
  ) {
    this.doc = doc
    this.controllerPath = controllerPath
    this.outputPath = outputPath
    this.options = options
  }

  generate(): RouteGenerationResult {
    const routes = collectRoutes(this.doc)
    if (routes.length === 0) {
      this.result.errors.push('No routes found in OpenAPI specification')
      return this.result
    }

    const content = this.generateFileContent(routes)
    this.writeFile(content)

    return this.result
  }

  private generateFileContent(routes: FlatRoute[]): string {
    const lines: string[] = []

    // Add file header
    lines.push(...buildFileHeader('Elysia routes from OpenAPI specification'))
    lines.push('// @ts-nocheck')
    lines.push('')

    // Add imports
    lines.push(...this.generateImports(routes))
    lines.push('')

    // Add route definitions
    lines.push(...this.generateRouteDefinitions(routes))

    return lines.join('\n')
  }

  private generateImports(routes: FlatRoute[]): string[] {
    const lines: string[] = []

    // Import Elysia
    lines.push("import { Elysia } from 'elysia'")

    // Import controllers - get unique top-level modules
    const topLevelModules = this.getTopLevelModules(routes)
    const relativeControllerPath = this.getRelativeControllerPath()

    if (topLevelModules.length > 0) {
      lines.push(
        `import { ${topLevelModules.join(', ')} } from '${relativeControllerPath}'`,
      )
    }

    return lines
  }

  private getTopLevelModules(routes: FlatRoute[]): string[] {
    const modules = new Set<string>()
    for (const route of routes) {
      if (route.controllerImportPath.length > 0) {
        modules.add(route.controllerImportPath[0])
      }
    }
    return Array.from(modules).sort()
  }

  private getRelativeControllerPath(): string {
    const outputDir = path.dirname(this.outputPath)
    let relativePath = path.relative(outputDir, this.controllerPath)

    // Convert Windows path separators to forward slashes
    relativePath = relativePath.split(path.sep).join('/')

    // Handle same directory case (empty relative path)
    if (relativePath === '') {
      return '.'
    }

    // Ensure it starts with ./
    if (!relativePath.startsWith('.')) {
      relativePath = './' + relativePath
    }

    return relativePath
  }

  private generateRouteDefinitions(routes: FlatRoute[]): string[] {
    const lines: string[] = []

    lines.push('export const routes = new Elysia()')

    for (const route of routes) {
      lines.push(this.generateRoute(route))
      this.result.routesGenerated++
    }

    lines.push('')

    return lines
  }

  private generateRoute(route: FlatRoute): string {
    const controllerPath = route.controllerImportPath.join('.')
    const handlerCall = `${controllerPath}.${route.handlerName}`

    const inputParts = this.buildInputParts(route)
    const destructure =
      inputParts.length > 0 ? `{ ${inputParts.join(', ')} }` : ''
    const inputObject = this.buildInputObject(route)

    return `  .${route.method}('${route.elysiaPath}', (${destructure}) => ${handlerCall}(${inputObject}))`
  }

  private buildInputParts(route: FlatRoute): string[] {
    const parts: string[] = []
    const operation = route.operation

    // Check for path params
    const pathParams = extractPathParams(route.path)
    if (pathParams.length > 0) {
      parts.push('params')
    }

    // Check for query params
    const hasQuery = (operation.parameters || []).some(
      (p) => !('$ref' in p) && p.in === 'query',
    )
    if (hasQuery) {
      parts.push('query')
    }

    // Check for headers
    const hasHeaders = (operation.parameters || []).some(
      (p) => !('$ref' in p) && p.in === 'header',
    )
    if (hasHeaders) {
      parts.push('headers')
    }

    // Check for request body
    if (operation.requestBody) {
      parts.push('body')
    }

    return parts
  }

  private buildInputObject(route: FlatRoute): string {
    const parts = this.buildInputParts(route)
    if (parts.length === 0) {
      return '{}'
    }
    return `{ ${parts.join(', ')} }`
  }

  private writeFile(content: string): void {
    const outputDir = path.dirname(this.outputPath)
    fs.mkdirSync(outputDir, { recursive: true })
    fs.writeFileSync(this.outputPath, content, 'utf-8')
    this.result.fileCreated = true

    // Format with prettier (auto-detect or use provided config)
    this.result.fileFormatted = formatFileWithPrettier(
      this.outputPath,
      this.options.prettierConfig,
    )
  }
}
