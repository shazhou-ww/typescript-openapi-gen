#!/usr/bin/env node
/**
 * Script to regenerate expected route files for all test cases
 * This updates the expected files to match the current generator output
 */

import * as fs from 'node:fs'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseOpenAPIFile } from '../dist/lib/openapi-parser/index.js'
import {
  ElysiaRouteGenerator,
  ExpressRouteGenerator,
  FastifyRouteGenerator,
  HonoRouteGenerator,
} from '../dist/lib/route-generator/index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')
const fixturesDir = path.join(projectRoot, 'test/e2e/fixtures')
const prettierConfig = path.join(projectRoot, '.prettierrc')

const frameworks = [
  {
    name: 'elysia',
    generator: ElysiaRouteGenerator,
    routeFile: 'elysia-router.gen.ts',
  },
  {
    name: 'express',
    generator: ExpressRouteGenerator,
    routeFile: 'express-router.gen.ts',
  },
  {
    name: 'fastify',
    generator: FastifyRouteGenerator,
    routeFile: 'fastify-router.gen.ts',
  },
  {
    name: 'hono',
    generator: HonoRouteGenerator,
    routeFile: 'hono-router.gen.ts',
  },
] as const

// Get all test case directories
function getTestCases(): string[] {
  const entries = fs.readdirSync(fixturesDir, { withFileTypes: true })
  return entries
    .filter((entry) => {
      if (!entry.isDirectory()) return false
      const hasInput = fs.existsSync(path.join(fixturesDir, entry.name, 'input'))
      const hasExpected = fs.existsSync(
        path.join(fixturesDir, entry.name, 'expected'),
      )
      return hasInput && hasExpected
    })
    .map((entry) => entry.name)
}

async function regenerateExpectedRoutes() {
  const testCases = getTestCases()
  console.log(`Found ${testCases.length} test cases: ${testCases.join(', ')}`)

  for (const testCase of testCases) {
    console.log(`\nProcessing test case: ${testCase}`)
    const testCaseDir = path.join(fixturesDir, testCase)
    const inputDir = path.join(testCaseDir, 'input')
    const expectedDir = path.join(testCaseDir, 'expected')

    // Find OpenAPI file
    const inputFiles = fs.readdirSync(inputDir)
    const openapiFile = inputFiles.find(
      (f) => f.endsWith('.yaml') || f.endsWith('.yml') || f.endsWith('.json'),
    )

    if (!openapiFile) {
      console.error(`  ⚠️  No OpenAPI file found in ${inputDir}`)
      continue
    }

    // Copy controller structure to temp location
    const expectedControllerDir = path.join(expectedDir, 'controller')
    if (!fs.existsSync(expectedControllerDir)) {
      console.error(`  ⚠️  Controller directory not found: ${expectedControllerDir}`)
      continue
    }

    const tempControllerDir = path.join(projectRoot, '.tmp-test', `controller-${testCase}`)
    fs.mkdirSync(path.dirname(tempControllerDir), { recursive: true })
    if (fs.existsSync(tempControllerDir)) {
      fs.rmSync(tempControllerDir, { recursive: true, force: true })
    }
    fs.cpSync(expectedControllerDir, tempControllerDir, { recursive: true })

    // Parse OpenAPI
    const openapiPath = path.join(inputDir, openapiFile)
    const openApiDoc = await parseOpenAPIFile(openapiPath)

    // Generate routes for each framework
    for (const framework of frameworks) {
      const outputPath = path.join(expectedDir, framework.routeFile)
      console.log(`  Generating ${framework.name} routes...`)

      const generator = new framework.generator(
        openApiDoc,
        tempControllerDir,
        outputPath,
        { prettierConfig },
      )
      generator.generate()

      if (fs.existsSync(outputPath)) {
        console.log(`    ✅ Updated ${framework.routeFile}`)
      } else {
        console.error(`    ❌ Failed to generate ${framework.routeFile}`)
      }
    }

    // Cleanup temp controller directory
    if (fs.existsSync(tempControllerDir)) {
      fs.rmSync(tempControllerDir, { recursive: true, force: true })
    }
  }

  console.log('\n✅ Done regenerating expected route files!')
}

regenerateExpectedRoutes().catch((error) => {
  console.error('Error:', error)
  process.exit(1)
})

