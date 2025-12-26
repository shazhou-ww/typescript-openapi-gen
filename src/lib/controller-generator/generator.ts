import * as fs from 'node:fs'
import * as path from 'node:path'
import type { OpenAPIDocument } from '../openapi-parser.js'
import type { SchemaObject, ReferenceObject } from '../shared/openapi-types.js'
import { formatFilesWithPrettier } from '../shared/formatter.js'
import type { GenerationResult, RouteInfo } from './types.js'
import { createEmptyResult } from './types.js'
import { segmentToFsName, checkForNamingConflicts } from './utils.js'
import { buildRouteTree } from './route-tree.js'
import { generateSharedTypesFolder } from './shared-types-generator.js'
import { generateTypesFile } from './types-file-generator.js'
import { generateMethodFileIfNotExists } from './method-file-generator.js'
import { generateMethodsFile } from './methods-generator.js'
import {
  generateIndexFile,
  generateRootIndexFile,
} from './index-file-generator.js'

export interface ControllerGeneratorOptions {
  prettierConfig?: string
  /** Subfolder name for controllers, defaults to 'controller' */
  controllerFolder?: string
  /** Subfolder name for shared types, defaults to 'shared-types' */
  sharedTypesFolder?: string
}

export class ControllerGenerator {
  private doc: OpenAPIDocument
  private outputDir: string
  private options: ControllerGeneratorOptions
  private result: GenerationResult = createEmptyResult()

  constructor(
    doc: OpenAPIDocument,
    outputDir: string,
    options: ControllerGeneratorOptions = {},
  ) {
    this.doc = doc
    this.outputDir = outputDir
    this.options = options
  }

  async generate(): Promise<GenerationResult> {
    const routeTree = buildRouteTree(this.doc)

    const controllerFolder = this.options.controllerFolder ?? 'controller'
    const sharedTypesFolder = this.options.sharedTypesFolder ?? 'shared-types'

    const controllerDir = path.join(this.outputDir, controllerFolder)
    const sharedTypesDir = path.join(this.outputDir, sharedTypesFolder)

    fs.mkdirSync(controllerDir, { recursive: true })

    const schemas = this.doc.components?.schemas as
      | Record<string, SchemaObject | ReferenceObject>
      | undefined
    generateSharedTypesFolder(sharedTypesDir, schemas, this.result)

    await this.generateControllersRecursive(
      routeTree,
      controllerDir,
      sharedTypesDir,
    )

    // Generate root index.ts that exports all top-level route modules
    generateRootIndexFile(controllerDir, routeTree, this.result)

    // Format generated files with prettier (auto-detect or use provided config)
    this.result.filesFormatted = formatFilesWithPrettier(
      this.result.generatedFiles,
      this.options.prettierConfig,
    )

    return this.result
  }

  private async generateControllersRecursive(
    nodes: Map<string, RouteInfo>,
    currentDir: string,
    sharedTypesDir: string,
  ): Promise<void> {
    for (const [segment, info] of nodes) {
      const fsSegment = segmentToFsName(segment)
      const controllerDir = path.join(currentDir, fsSegment)

      this.checkConflicts(info)
      this.createDirectoryIfNeeded(controllerDir, info)
      await this.generateControllerIfNeeded(controllerDir, info, sharedTypesDir)

      // Generate methods.gen.ts with validation wrappers
      generateMethodsFile(controllerDir, info, this.result)

      generateIndexFile(controllerDir, info, this.result)

      await this.generateControllersRecursive(
        info.children,
        controllerDir,
        sharedTypesDir,
      )
    }
  }

  private checkConflicts(info: RouteInfo): void {
    if (checkForNamingConflicts(info)) {
      this.result.errors.push(
        `Naming conflict at path ${info.path}: child route name conflicts with method handler`,
      )
    }
  }

  private createDirectoryIfNeeded(
    controllerDir: string,
    info: RouteInfo,
  ): void {
    if (info.methods.size > 0 || info.children.size > 0) {
      fs.mkdirSync(controllerDir, { recursive: true })
    }
  }

  private async generateControllerIfNeeded(
    controllerDir: string,
    info: RouteInfo,
    sharedTypesDir: string,
  ): Promise<void> {
    if (info.methods.size === 0) return

    this.result.controllersGenerated++
    generateTypesFile(controllerDir, info, sharedTypesDir, this.result)

    for (const [method, operation] of info.methods) {
      generateMethodFileIfNotExists(
        controllerDir,
        method,
        operation,
        this.result,
      )
    }
  }
}
