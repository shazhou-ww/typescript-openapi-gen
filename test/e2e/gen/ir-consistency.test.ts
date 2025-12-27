import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import * as fs from 'node:fs'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
import * as yaml from 'js-yaml'
import { parseOpenAPIFile } from '../../../src/lib/openapi-parser'
import { buildRouteTree } from '../../../src/lib/controller-generator/route-tree'
import { segmentToFsName } from '../../../src/lib/controller-generator/utils'
import type { RouteInfo } from '../../../src/lib/controller-generator/types'
import type { OpenAPIDocument } from '../../../src/lib/openapi-parser'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const fixturesDir = path.join(__dirname, '../fixtures')
const mitseinInputDir = path.join(fixturesDir, 'mitsein', 'input')

/**
 * Convert IR document to standard OpenAPI format (same as gen openapi command)
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
 * Generate all-in-one OpenAPI file (same logic as gen openapi command)
 */
function generateAllInOneOpenAPI(doc: OpenAPIDocument): OpenAPIDocument {
  return convertToStandardOpenAPI(doc)
}

/**
 * Normalize IR for comparison (remove order-dependent differences)
 */
function normalizeIR(ir: any): any {
  const normalized = JSON.parse(JSON.stringify(ir))

  // Sort paths keys
  if (normalized.paths && typeof normalized.paths === 'object') {
    const sortedPaths: any = {}
    const sortedKeys = Object.keys(normalized.paths).sort()
    for (const key of sortedKeys) {
      sortedPaths[key] = normalized.paths[key]
    }
    normalized.paths = sortedPaths
  }

  // Sort components.schemas keys
  if (normalized.components?.schemas && typeof normalized.components.schemas === 'object') {
    const sortedSchemas: any = {}
    const sortedKeys = Object.keys(normalized.components.schemas).sort()
    for (const key of sortedKeys) {
      sortedSchemas[key] = normalized.components.schemas[key]
    }
    normalized.components.schemas = sortedSchemas
  }

  // Sort components.parameters keys
  if (normalized.components?.parameters && typeof normalized.components.parameters === 'object') {
    const sortedParams: any = {}
    const sortedKeys = Object.keys(normalized.components.parameters).sort()
    for (const key of sortedKeys) {
      sortedParams[key] = normalized.components.parameters[key]
    }
    normalized.components.parameters = sortedParams
  }

  // Sort components.responses keys
  if (normalized.components?.responses && typeof normalized.components.responses === 'object') {
    const sortedResponses: any = {}
    const sortedKeys = Object.keys(normalized.components.responses).sort()
    for (const key of sortedKeys) {
      sortedResponses[key] = normalized.components.responses[key]
    }
    normalized.components.responses = sortedResponses
  }

  return normalized
}

/**
 * Deep compare two IR objects
 */
function compareIR(ir1: any, ir2: any, path: string = ''): string[] {
  const differences: string[] = []

  if (ir1 === ir2) {
    return differences
  }

  if (ir1 === null || ir2 === null || ir1 === undefined || ir2 === undefined) {
    differences.push(`${path}: ${JSON.stringify(ir1)} !== ${JSON.stringify(ir2)}`)
    return differences
  }

  if (typeof ir1 !== typeof ir2) {
    differences.push(`${path}: type mismatch (${typeof ir1} !== ${typeof ir2})`)
    return differences
  }

  if (typeof ir1 !== 'object' || Array.isArray(ir1)) {
    if (JSON.stringify(ir1) !== JSON.stringify(ir2)) {
      differences.push(`${path}: ${JSON.stringify(ir1)} !== ${JSON.stringify(ir2)}`)
    }
    return differences
  }

  // Compare objects
  const keys1 = Object.keys(ir1).sort()
  const keys2 = Object.keys(ir2).sort()

  // Check for missing keys
  for (const key of keys1) {
    if (!(key in ir2)) {
      differences.push(`${path}.${key}: missing in ir2`)
    }
  }

  for (const key of keys2) {
    if (!(key in ir1)) {
      differences.push(`${path}.${key}: missing in ir1`)
    }
  }

  // Compare common keys
  for (const key of keys1) {
    if (key in ir2) {
      const newPath = path ? `${path}.${key}` : key
      differences.push(...compareIR(ir1[key], ir2[key], newPath))
    }
  }

  return differences
}

describe('IR Consistency Test - Mitsein', () => {
  let tempOutputDir: string

  beforeAll(() => {
    tempOutputDir = fs.mkdtempSync(path.join(mitseinInputDir, 'temp-ir-'))
  })

  afterAll(() => {
    if (tempOutputDir && fs.existsSync(tempOutputDir)) {
      fs.rmSync(tempOutputDir, { recursive: true, force: true })
    }
  })

  describe('All-in-one mode', () => {
    it('should generate IR that matches original definition IR', async () => {
      // Step 1: Parse original definition and generate IR1
      const originalFile = path.join(mitseinInputDir, 'mitsein.allinone.yaml')
      console.log(`\n📄 Step 1: Parsing original definition: ${originalFile}`)
      const originalIR = await parseOpenAPIFile(originalFile)
      const normalizedOriginalIR = normalizeIR(originalIR)
      console.log(`   ✅ Original IR parsed (${Object.keys(normalizedOriginalIR.paths || {}).length} paths, ${Object.keys(normalizedOriginalIR.components?.schemas || {}).length} schemas)`)

      // Step 2: Generate OpenAPI file using gen openapi logic
      console.log(`\n📝 Step 2: Generating OpenAPI file from IR...`)
      const generatedDoc = generateAllInOneOpenAPI(originalIR)
      const generatedFilePath = path.join(tempOutputDir, 'generated.allinone.yaml')
      fs.writeFileSync(generatedFilePath, yaml.dump(generatedDoc, { indent: 2 }))
      console.log(`   ✅ Generated OpenAPI file: ${generatedFilePath}`)

      // Step 3: Parse generated file and generate IR2
      console.log(`\n🔄 Step 3: Parsing generated OpenAPI file to generate IR2...`)
      const generatedIR = await parseOpenAPIFile(generatedFilePath)
      const normalizedGeneratedIR = normalizeIR(generatedIR)
      console.log(`   ✅ Generated IR parsed (${Object.keys(normalizedGeneratedIR.paths || {}).length} paths, ${Object.keys(normalizedGeneratedIR.components?.schemas || {}).length} schemas)`)

      // Step 4: Compare IRs
      console.log(`\n🔍 Step 4: Comparing IRs...`)
      const differences = compareIR(normalizedOriginalIR, normalizedGeneratedIR)

      if (differences.length > 0) {
        console.error(`\n❌ Found ${differences.length} differences:`)
        for (const diff of differences.slice(0, 50)) { // Show first 50 differences
          console.error(`  ${diff}`)
        }
        if (differences.length > 50) {
          console.error(`  ... and ${differences.length - 50} more differences`)
        }
        expect.fail(`IRs are not identical. Found ${differences.length} differences.`)
      } else {
        console.log(`   ✅ IRs are identical!`)
      }
    })
  })

  describe('Split mode', () => {
    it('should generate IR that matches original definition IR', async () => {
      // Step 1: Parse original split definition and generate IR1
      const originalFile = path.join(mitseinInputDir, 'mitsein.yaml')
      console.log(`\n📄 Step 1: Parsing original split definition: ${originalFile}`)
      const originalIR = await parseOpenAPIFile(originalFile)
      const normalizedOriginalIR = normalizeIR(originalIR)
      console.log(`   ✅ Original IR parsed (${Object.keys(normalizedOriginalIR.paths || {}).length} paths, ${Object.keys(normalizedOriginalIR.components?.schemas || {}).length} schemas)`)

      // Step 2: Generate allinone OpenAPI file from the split IR
      // This simulates what gen openapi --allinone would do
      console.log(`\n📝 Step 2: Generating allinone OpenAPI file from split IR...`)
      const generatedDoc = generateAllInOneOpenAPI(originalIR)
      const generatedFilePath = path.join(tempOutputDir, 'generated-split.allinone.yaml')
      fs.writeFileSync(generatedFilePath, yaml.dump(generatedDoc, { indent: 2 }))
      console.log(`   ✅ Generated OpenAPI file: ${generatedFilePath}`)

      // Step 3: Parse generated file and generate IR2
      console.log(`\n🔄 Step 3: Parsing generated OpenAPI file to generate IR2...`)
      const generatedIR = await parseOpenAPIFile(generatedFilePath)
      const normalizedGeneratedIR = normalizeIR(generatedIR)
      console.log(`   ✅ Generated IR parsed (${Object.keys(normalizedGeneratedIR.paths || {}).length} paths, ${Object.keys(normalizedGeneratedIR.components?.schemas || {}).length} schemas)`)

      // Step 4: Compare IRs
      console.log(`\n🔍 Step 4: Comparing IRs...`)
      const differences = compareIR(normalizedOriginalIR, normalizedGeneratedIR)

      if (differences.length > 0) {
        console.error(`\n❌ Found ${differences.length} differences:`)
        for (const diff of differences.slice(0, 50)) { // Show first 50 differences
          console.error(`  ${diff}`)
        }
        if (differences.length > 50) {
          console.error(`  ... and ${differences.length - 50} more differences`)
        }
        expect.fail(`IRs are not identical. Found ${differences.length} differences.`)
      } else {
        console.log(`   ✅ IRs are identical!`)
      }
    })
  })
})

