import { Command } from 'commander'
import * as fs from 'node:fs'
import * as path from 'node:path'
import * as yaml from 'js-yaml'
import { parseOpenAPIFile } from '../../lib/openapi-parser'
import { buildRouteTree } from '../../lib/controller-generator/route-tree'
import { segmentToFsName } from '../../lib/controller-generator/utils'
import type { RouteInfo } from '../../lib/controller-generator/types'
import type { OpenAPIDocument } from '../../lib/openapi-parser'
import type { OperationObject } from '../../lib/shared/openapi-types'

function registerOpenapiCommand(program: Command) {
  program
    .command('openapi')
    .description('Generate OpenAPI files from IR, organized like controller structure')
    .argument('<file>', 'OpenAPI specification file (YAML or JSON)')
    .requiredOption('-o, --output-dir <path>', 'Output directory for generated files')
    .option('--controller-folder <name>', 'Subfolder name for controllers (default: controller)')
    .option('--shared-types-folder <name>', 'Subfolder name for shared types (default: shared-types)')
    .option('--allinone <name>', 'Generate a single all-in-one OpenAPI file with this name')
    .action(async (file: string, options: {
      outputDir: string
      controllerFolder?: string
      sharedTypesFolder?: string
      allinone?: string
    }) => {
      const inputFile = path.resolve(file)
      const outputDir = path.resolve(options.outputDir)
      const controllerFolder = options.controllerFolder ?? 'controller'
      const sharedTypesFolder = options.sharedTypesFolder ?? 'shared-types'
      const allinoneName = options.allinone

      if (!fs.existsSync(inputFile)) {
        console.error(`Input file not found: ${inputFile}`)
        process.exit(1)
      }

      try {
        console.log(`Loading OpenAPI file: ${inputFile}`)
        const doc = await parseOpenAPIFile(inputFile)

        if (allinoneName) {
          // Generate single all-in-one file
          console.log(`\n📄 Generating all-in-one OpenAPI file: ${allinoneName}.oapi.yaml`)
          const allinoneDoc = convertToStandardOpenAPI(doc)
          const outputPath = path.join(outputDir, `${allinoneName}.oapi.yaml`)
          fs.mkdirSync(outputDir, { recursive: true })
          fs.writeFileSync(outputPath, yaml.dump(allinoneDoc, { indent: 2 }))
          console.log(`   ✅ Generated: ${outputPath}`)
        } else {
          // Generate split files
          console.log(`\n📁 Generating split OpenAPI files...`)
          const controllerDir = path.join(outputDir, controllerFolder)
          const sharedTypesDir = path.join(outputDir, sharedTypesFolder)
          fs.mkdirSync(controllerDir, { recursive: true })
          fs.mkdirSync(sharedTypesDir, { recursive: true })

          // Generate shared types
          console.log(`\n📦 Generating shared types...`)
          const schemas = doc.components?.schemas || {}
          let typesGenerated = 0
          for (const [typeName, schema] of Object.entries(schemas)) {
            const typeDoc = createTypeOpenAPIDoc(doc, typeName, schema)
            const standardDoc = convertToStandardOpenAPI(typeDoc)
            const outputPath = path.join(sharedTypesDir, `${typeName}.oapi.yaml`)
            fs.writeFileSync(outputPath, yaml.dump(standardDoc, { indent: 2 }))
            typesGenerated++
          }
          console.log(`   ✅ Generated ${typesGenerated} type files in ${sharedTypesFolder}/`)

          // Generate controller files
          console.log(`\n📂 Generating controller OpenAPI files...`)
          const routeTree = buildRouteTree(doc)
          await generateControllerFilesRecursive(routeTree, controllerDir, doc)
          console.log(`   ✅ Generated controller files in ${controllerFolder}/`)

          console.log(`\n✅ Generation complete!`)
          console.log(`   Output directory: ${outputDir}`)
          console.log(`   Controller folder: ${controllerFolder}/`)
          console.log(`   Shared types folder: ${sharedTypesFolder}/`)
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error(`Failed to generate: ${error.message}`)
        } else {
          console.error(`Failed to generate: ${String(error)}`)
        }
        process.exit(1)
      }
    })
}

async function generateControllerFilesRecursive(
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
    await generateControllerFilesRecursive(info.children, controllerDir, mainDoc)
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
  const converted = JSON.parse(JSON.stringify(doc)) as OpenAPIDocument // Deep clone

  // Convert all type name references back to standard format
  if (converted.paths) {
    for (const [pathKey, pathItem] of Object.entries(converted.paths)) {
      if (pathItem) {
        converted.paths[pathKey] = convertTypeRefsToStandard(pathItem, doc) as any
      }
    }
  }

  if (converted.components?.schemas) {
    for (const [schemaName, schema] of Object.entries(converted.components.schemas)) {
      converted.components.schemas[schemaName] = convertTypeRefsToStandard(schema, doc) as any
    }
  }

  return converted
}

/**
 * Create OpenAPI document for a single type
 */
function createTypeOpenAPIDoc(mainDoc: OpenAPIDocument, typeName: string, schema: any): OpenAPIDocument {
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
  const schemas: any = {
    [typeName]: convertedSchema,
  }

  for (const refTypeName of referencedSchemas) {
    if (refTypeName !== typeName && mainDoc.components?.schemas?.[refTypeName]) {
      schemas[refTypeName] = convertTypeRefsToStandard(mainDoc.components.schemas[refTypeName], mainDoc)
    }
  }

  doc.components = { schemas }
  return doc as OpenAPIDocument
}

/**
 * Create OpenAPI document for a controller (path segment and all its children)
 */
function createControllerOpenAPIDoc(mainDoc: OpenAPIDocument, routeInfo: RouteInfo): OpenAPIDocument {
  const paths: any = {}

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
  const schemas: any = {}
  for (const schemaName of usedSchemas) {
    if (mainDoc.components?.schemas?.[schemaName]) {
      schemas[schemaName] = convertTypeRefsToStandard(mainDoc.components.schemas[schemaName], mainDoc)
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
function collectPathsFromRouteInfo(routeInfo: RouteInfo, paths: any, mainDoc: OpenAPIDocument): void {
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
function collectRefsFromOperation(operation: OperationObject, schemas: Set<string>): void {
  if (!operation || typeof operation !== 'object') return

  // Check requestBody
  if (operation.requestBody && typeof operation.requestBody === 'object' && 'content' in operation.requestBody) {
    const contentObj = operation.requestBody.content
    if (contentObj && typeof contentObj === 'object') {
      for (const key of Object.keys(contentObj)) {
        const content = (contentObj as any)[key]
        if (content && typeof content === 'object' && 'schema' in content) {
          collectRefsFromSchema(content.schema, schemas)
        }
      }
    }
  }

  // Check responses
  if (operation.responses && typeof operation.responses === 'object') {
    for (const key of Object.keys(operation.responses)) {
      const response = (operation.responses as any)[key]
      if (response && typeof response === 'object' && 'content' in response) {
        const contentObj = response.content
        if (contentObj && typeof contentObj === 'object') {
          for (const contentKey of Object.keys(contentObj)) {
            const content = (contentObj as any)[contentKey]
            if (content && typeof content === 'object' && 'schema' in content) {
              collectRefsFromSchema(content.schema, schemas)
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
        collectRefsFromSchema((param as any).schema, schemas)
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

module.exports = registerOpenapiCommand

