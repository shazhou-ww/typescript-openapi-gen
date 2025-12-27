import { Args, Command, Flags } from '@oclif/core'
import * as fs from 'node:fs'
import * as path from 'node:path'
import * as yaml from 'js-yaml'
import { parseOpenAPIFile } from '../../lib/openapi-parser'
import { buildRouteTree } from '../../lib/controller-generator/route-tree'
import { segmentToFsName } from '../../lib/controller-generator/utils'
import type { RouteInfo } from '../../lib/controller-generator/types'
import type { OpenAPIDocument } from '../../lib/openapi-parser'

export default class GenOpenapi extends Command {
  static override args = {
    file: Args.string({
      description: 'OpenAPI specification file (YAML or JSON)',
      required: true,
    }),
  }

  static override description =
    'Generate OpenAPI files from IR, organized like controller structure'

  static override examples = [
    '<%= config.bin %> <%= command.id %> --output-dir ./output openapi.yaml',
    '<%= config.bin %> <%= command.id %> -o ./output --allinone api openapi.yaml',
  ]

  static override flags = {
    'output-dir': Flags.string({
      char: 'o',
      description: 'Output directory for generated files',
      required: true,
    }),
    'controller-folder': Flags.string({
      description: 'Subfolder name for controllers (default: controller)',
      required: false,
    }),
    'shared-types-folder': Flags.string({
      description: 'Subfolder name for shared types (default: shared-types)',
      required: false,
    }),
    allinone: Flags.string({
      description: 'Generate a single all-in-one OpenAPI file with this name',
      required: false,
    }),
  }

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(GenOpenapi)

    const inputFile = path.resolve(args.file)
    const outputDir = path.resolve(flags['output-dir'])
    const controllerFolder = flags['controller-folder'] ?? 'controller'
    const sharedTypesFolder = flags['shared-types-folder'] ?? 'shared-types'
    const allinoneName = flags.allinone

    if (!fs.existsSync(inputFile)) {
      this.error(`Input file not found: ${inputFile}`)
    }

    try {
      this.log(`Loading OpenAPI file: ${inputFile}`)
      const doc = await parseOpenAPIFile(inputFile)

      if (allinoneName) {
        // Generate single all-in-one file
        this.log(`\n📄 Generating all-in-one OpenAPI file: ${allinoneName}.oapi.yaml`)
        const allinoneDoc = convertToStandardOpenAPI(doc)
        const outputPath = path.join(outputDir, `${allinoneName}.oapi.yaml`)
        fs.mkdirSync(outputDir, { recursive: true })
        fs.writeFileSync(outputPath, yaml.dump(allinoneDoc, { indent: 2 }))
        this.log(`   ✅ Generated: ${outputPath}`)
      } else {
        // Generate split files
        this.log(`\n📁 Generating split OpenAPI files...`)
        const controllerDir = path.join(outputDir, controllerFolder)
        const sharedTypesDir = path.join(outputDir, sharedTypesFolder)

        fs.mkdirSync(controllerDir, { recursive: true })
        fs.mkdirSync(sharedTypesDir, { recursive: true })

        // Generate shared types
        this.log(`\n📦 Generating shared types...`)
        const schemas = doc.components?.schemas || {}
        let typesGenerated = 0
        for (const [typeName, schema] of Object.entries(schemas)) {
          const typeDoc = createTypeOpenAPIDoc(doc, typeName, schema)
          const standardDoc = convertToStandardOpenAPI(typeDoc)
          const outputPath = path.join(sharedTypesDir, `${typeName}.oapi.yaml`)
          fs.writeFileSync(outputPath, yaml.dump(standardDoc, { indent: 2 }))
          typesGenerated++
        }
        this.log(`   ✅ Generated ${typesGenerated} type files in ${sharedTypesFolder}/`)

        // Generate controller files
        this.log(`\n📂 Generating controller OpenAPI files...`)
        const routeTree = buildRouteTree(doc)
        let controllersGenerated = 0
        await this.generateControllerFilesRecursive(
          routeTree,
          controllerDir,
          doc,
        )
        this.log(`   ✅ Generated controller files in ${controllerFolder}/`)

        this.log(`\n✅ Generation complete!`)
        this.log(`   Output directory: ${outputDir}`)
        this.log(`   Controller folder: ${controllerFolder}/`)
        this.log(`   Shared types folder: ${sharedTypesFolder}/`)
      }
    } catch (error) {
      if (error instanceof Error) {
        this.error(`Failed to generate: ${error.message}`)
      } else {
        this.error(`Failed to generate: ${String(error)}`)
      }
    }
  }

  private async generateControllerFilesRecursive(
    nodes: Map<string, RouteInfo>,
    currentDir: string,
    mainDoc: OpenAPIDocument,
  ): Promise<void> {
    for (const [segment, info] of nodes) {
      const fsSegment = segmentToFsName(segment)
      const controllerDir = path.join(currentDir, fsSegment)

      fs.mkdirSync(controllerDir, { recursive: true })

      // Generate api.oapi.yaml for this controller if it has methods or children
      if (info.methods.size > 0 || info.children.size > 0) {
        const controllerDoc = createControllerOpenAPIDoc(mainDoc, info)
        const standardDoc = convertToStandardOpenAPI(controllerDoc)
        
        // Only write if there are paths to include
        if (Object.keys(standardDoc.paths || {}).length > 0) {
          const outputPath = path.join(controllerDir, 'api.oapi.yaml')
          fs.writeFileSync(outputPath, yaml.dump(standardDoc, { indent: 2 }))
        }
      }

      // Recursively process children
      await this.generateControllerFilesRecursive(
        info.children,
        controllerDir,
        mainDoc,
      )
    }
  }
}

/**
 * Convert type name references back to standard OpenAPI format
 * { "$ref": "TypeName" } -> { "$ref": "#/components/schemas/TypeName" }
 */
function convertTypeRefsToStandard(obj: any, mainDoc: OpenAPIDocument): any {
  if (obj === null || obj === undefined) {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map(item => convertTypeRefsToStandard(item, mainDoc))
  }

  if (typeof obj === 'object') {
    // Check if this is a type name reference
    if ('$ref' in obj && typeof obj.$ref === 'string') {
      const ref = obj.$ref
      // If it's a simple type name (not a path), convert to standard format
      if (!ref.startsWith('#') && !ref.startsWith('./') && !ref.startsWith('../')) {
        // Check if it exists in components.schemas
        if (mainDoc.components?.schemas?.[ref]) {
          return { "$ref": `#/components/schemas/${ref}` }
        }
      }
      // Already in standard format or external reference, return as-is
      return obj
    }

    // Recursively process object properties
    const result: any = {}
    for (const [key, value] of Object.entries(obj)) {
      result[key] = convertTypeRefsToStandard(value, mainDoc)
    }
    return result
  }

  return obj
}

/**
 * Convert IR document to standard OpenAPI format
 */
function convertToStandardOpenAPI(doc: OpenAPIDocument): OpenAPIDocument {
  const converted = JSON.parse(JSON.stringify(doc)) // Deep clone

  // Convert all type name references back to standard format
  if (converted.paths) {
    for (const [pathKey, pathItem] of Object.entries(converted.paths)) {
      if (pathItem) {
        converted.paths[pathKey] = convertTypeRefsToStandard(pathItem, doc)
      }
    }
  }

  if (converted.components?.schemas) {
    for (const [schemaName, schema] of Object.entries(converted.components.schemas)) {
      converted.components.schemas[schemaName] = convertTypeRefsToStandard(schema, doc)
    }
  }

  return converted
}

/**
 * Create OpenAPI document for a single type
 */
function createTypeOpenAPIDoc(
  mainDoc: OpenAPIDocument,
  typeName: string,
  schema: any,
): OpenAPIDocument {
  const doc: any = {}
  
  // Preserve info
  if (mainDoc.info) {
    doc.info = mainDoc.info
  }
  
  // Preserve openapi or swagger version
  if ('openapi' in mainDoc && mainDoc.openapi) {
    doc.openapi = mainDoc.openapi
  } else if ('swagger' in mainDoc && (mainDoc as any).swagger) {
    doc.swagger = (mainDoc as any).swagger
  } else {
    doc.openapi = '3.1.0'
  }
  
  // Convert schema and collect all referenced schemas
  const convertedSchema = convertTypeRefsToStandard(schema, mainDoc)
  const referencedSchemas = new Set<string>()
  collectRefsFromSchema(convertedSchema, referencedSchemas)
  
  // Build components with the type and all its referenced types
  const schemas: Record<string, any> = {
    [typeName]: convertedSchema,
  }
  
  for (const refTypeName of referencedSchemas) {
    if (refTypeName !== typeName && mainDoc.components?.schemas?.[refTypeName]) {
      schemas[refTypeName] = convertTypeRefsToStandard(
        mainDoc.components.schemas[refTypeName],
        mainDoc,
      )
    }
  }
  
  doc.components = { schemas }
  
  return doc as OpenAPIDocument
}

/**
 * Create OpenAPI document for a controller (path segment and all its children)
 */
function createControllerOpenAPIDoc(
  mainDoc: OpenAPIDocument,
  routeInfo: RouteInfo,
): OpenAPIDocument {
  const paths: Record<string, any> = {}
  
  // Add current path methods
  if (routeInfo.methods.size > 0) {
    paths[routeInfo.path] = {}
    for (const [method, operation] of routeInfo.methods) {
      paths[routeInfo.path][method] = convertTypeRefsToStandard(operation, mainDoc)
    }
  }
  
  // Add all child paths recursively
  collectPathsFromRouteInfo(routeInfo, paths, mainDoc)

  // Collect all schemas used in this controller and its children
  const usedSchemas = new Set<string>()
  collectSchemaRefs(routeInfo, usedSchemas)

  // Build components with only used schemas
  const schemas: Record<string, any> = {}
  for (const schemaName of usedSchemas) {
    if (mainDoc.components?.schemas?.[schemaName]) {
      schemas[schemaName] = convertTypeRefsToStandard(
        mainDoc.components.schemas[schemaName],
        mainDoc,
      )
    }
  }

  const doc: any = {}
  
  // Preserve info
  if (mainDoc.info) {
    doc.info = mainDoc.info
  }
  
  // Preserve openapi or swagger version
  if ('openapi' in mainDoc && mainDoc.openapi) {
    doc.openapi = mainDoc.openapi
  } else if ('swagger' in mainDoc && (mainDoc as any).swagger) {
    doc.swagger = (mainDoc as any).swagger
  } else {
    doc.openapi = '3.1.0'
  }
  
  // Add paths
  doc.paths = paths
  
  // Add components if there are schemas
  if (Object.keys(schemas).length > 0) {
    doc.components = { schemas }
  }
  
  return doc as OpenAPIDocument
}

/**
 * Collect all paths from a route info and its children
 */
function collectPathsFromRouteInfo(
  routeInfo: RouteInfo,
  paths: Record<string, any>,
  mainDoc: OpenAPIDocument,
): void {
  // Add current path if it has methods
  if (routeInfo.methods.size > 0 && !paths[routeInfo.path]) {
    paths[routeInfo.path] = {}
    for (const [method, operation] of routeInfo.methods) {
      paths[routeInfo.path][method] = convertTypeRefsToStandard(operation, mainDoc)
    }
  }

  // Recursively collect from children
  for (const child of routeInfo.children.values()) {
    collectPathsFromRouteInfo(child, paths, mainDoc)
  }
}

/**
 * Collect all schema references used in a route
 */
function collectSchemaRefs(routeInfo: RouteInfo, schemas: Set<string>): void {
  for (const [method, operation] of routeInfo.methods) {
    collectRefsFromOperation(operation, schemas)
  }

  // Recursively collect from children
  for (const child of routeInfo.children.values()) {
    collectSchemaRefs(child, schemas)
  }
}

/**
 * Collect schema references from an operation
 */
function collectRefsFromOperation(operation: any, schemas: Set<string>): void {
  if (!operation || typeof operation !== 'object') return

  // Check requestBody
  if (operation.requestBody && typeof operation.requestBody === 'object' && 'content' in operation.requestBody) {
    const contentObj = (operation.requestBody as any).content
    if (contentObj && typeof contentObj === 'object') {
      for (const key of Object.keys(contentObj)) {
        const content = (contentObj as any)[key]
        if (content && typeof content === 'object' && 'schema' in content) {
          collectRefsFromSchema((content as any).schema, schemas)
        }
      }
    }
  }

  // Check responses
  if (operation.responses && typeof operation.responses === 'object') {
    for (const key of Object.keys(operation.responses)) {
      const response = (operation.responses as any)[key]
      if (response && typeof response === 'object' && 'content' in response) {
        const contentObj = (response as any).content
        if (contentObj && typeof contentObj === 'object') {
          for (const contentKey of Object.keys(contentObj)) {
            const content = (contentObj as any)[contentKey]
            if (content && typeof content === 'object' && 'schema' in content) {
              collectRefsFromSchema((content as any).schema, schemas)
            }
          }
        }
      }
    }
  }

  // Check parameters
  if (Array.isArray(operation.parameters)) {
    for (const param of operation.parameters) {
      if (param && typeof param === 'object' && 'schema' in param) {
        collectRefsFromSchema(param.schema, schemas)
      }
    }
  }
}

/**
 * Collect schema references from a schema object
 */
function collectRefsFromSchema(schema: any, schemas: Set<string>): void {
  if (!schema || typeof schema !== 'object') return

  // Check for type name reference
  if ('$ref' in schema && typeof schema.$ref === 'string') {
    const ref = schema.$ref
    // If it's a simple type name (not a path), add it
    if (!ref.startsWith('#') && !ref.startsWith('./') && !ref.startsWith('../')) {
      schemas.add(ref)
      return
    }
    // If it's a standard reference, extract type name
    if (ref.startsWith('#/components/schemas/')) {
      const typeName = ref.replace('#/components/schemas/', '')
      schemas.add(typeName)
      return
    }
  }

  // Recursively check properties, items, allOf, anyOf, oneOf
  if (schema.properties) {
    for (const prop of Object.values(schema.properties)) {
      collectRefsFromSchema(prop, schemas)
    }
  }

  if (schema.items) {
    collectRefsFromSchema(schema.items, schemas)
  }

  if (Array.isArray(schema.allOf)) {
    for (const item of schema.allOf) {
      collectRefsFromSchema(item, schemas)
    }
  }

  if (Array.isArray(schema.anyOf)) {
    for (const item of schema.anyOf) {
      collectRefsFromSchema(item, schemas)
    }
  }

  if (Array.isArray(schema.oneOf)) {
    for (const item of schema.oneOf) {
      collectRefsFromSchema(item, schemas)
    }
  }
}
