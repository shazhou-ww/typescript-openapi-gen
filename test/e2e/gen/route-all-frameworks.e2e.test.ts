import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import * as fs from 'node:fs'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseOpenAPIFile } from '../../../src/lib/openapi-parser'
import {
  ElysiaRouteGenerator,
  ExpressRouteGenerator,
  FastifyRouteGenerator,
  HonoRouteGenerator,
} from '../../../src/lib/route-generator/index'

// Read file content with normalized line endings
function readFileNormalized(filePath: string): string {
  return fs.readFileSync(filePath, 'utf-8').replace(/\r\n/g, '\n')
}

// Generate a diff-like output for two strings
// Groups adjacent differences together by +/- signs
function generateDiff(expected: string, actual: string): string {
  const expectedLines = expected.split('\n')
  const actualLines = actual.split('\n')
  const lines: string[] = []
  const maxLen = Math.max(expectedLines.length, actualLines.length)

  let i = 0
  while (i < maxLen) {
    const expLine = expectedLines[i]
    const actLine = actualLines[i]

    if (expLine === actLine) {
      // Same line, just show it
      lines.push(`  ${i + 1}: ${expLine ?? ''}`)
      i++
    } else {
      // Found a difference, collect all adjacent differences
      const removedLines: string[] = []
      const addedLines: string[] = []

      // Collect consecutive differences
      while (i < maxLen) {
        const exp = expectedLines[i]
        const act = actualLines[i]

        if (exp === act) {
          // End of difference group
          break
        }

        if (exp !== undefined) {
          removedLines.push(`- ${i + 1}: ${exp}`)
        }
        if (act !== undefined) {
          addedLines.push(`+ ${i + 1}: ${act}`)
        }
        i++
      }

      // Add the grouped differences: first all removals (-), then all additions (+)
      lines.push(...removedLines, ...addedLines)
    }
  }

  return lines.join('\n')
}

const e2eDir = path.dirname(fileURLToPath(import.meta.url))
const fixturesDir = path.join(e2eDir, '../fixtures')
const projectRoot = path.resolve(e2eDir, '../../')

// Find prettier config file
function findPrettierConfig(): string | undefined {
  const configFiles = [
    '.prettierrc',
    '.prettierrc.json',
    '.prettierrc.yml',
    '.prettierrc.yaml',
    'prettier.config.js',
    'prettier.config.cjs',
  ]

  for (const configFile of configFiles) {
    const configPath = path.join(projectRoot, configFile)
    if (fs.existsSync(configPath)) {
      return configPath
    }
  }

  return undefined
}

const prettierConfig = findPrettierConfig()

// Get all test case directories (directories with input/expected subdirs)
function getTestCases(): string[] {
  const entries = fs.readdirSync(fixturesDir, { withFileTypes: true })
  return entries
    .filter((entry) => {
      if (!entry.isDirectory()) return false
      // Check if it has input and expected subdirectories
      const hasInput = fs.existsSync(path.join(fixturesDir, entry.name, 'input'))
      const hasExpected = fs.existsSync(
        path.join(fixturesDir, entry.name, 'expected'),
      )
      return hasInput && hasExpected
    })
    .map((entry) => entry.name)
}

// Framework configurations
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

describe('Route Generator E2E Tests (All Frameworks)', () => {
  const testCases = getTestCases()

  for (const testCase of testCases) {
    for (const framework of frameworks) {
      describe(`Test case: ${testCase} - ${framework.name}`, () => {
        const testCaseDir = path.join(fixturesDir, testCase)
        const inputDir = path.join(testCaseDir, 'input')
        const expectedDir = path.join(testCaseDir, 'expected')
        let tempOutputDir: string
        let outputFilePath: string

        beforeAll(async () => {
          // Create temp directory in system temp folder
          const os = await import('node:os')
          tempOutputDir = fs.mkdtempSync(
            path.join(
              os.tmpdir(),
              `typescript-openapi-gen-route-${framework.name}-${testCase}-`,
            ),
          )

          // Find OpenAPI file in input directory
          const inputFiles = fs.readdirSync(inputDir)
          const openapiFile = inputFiles.find(
            (f) =>
              f.endsWith('.yaml') || f.endsWith('.yml') || f.endsWith('.json'),
          )

          if (!openapiFile) {
            throw new Error(`No OpenAPI file found in ${inputDir}`)
          }

          // Copy the expected controller structure to temp/controller
          const expectedControllerDir = path.join(expectedDir, 'controller')
          const tempControllerDir = path.join(tempOutputDir, 'controller')
          fs.cpSync(expectedControllerDir, tempControllerDir, {
            recursive: true,
          })

          // Parse and generate routes
          const openapiPath = path.join(inputDir, openapiFile)
          outputFilePath = path.join(tempOutputDir, framework.routeFile)

          const openApiDoc = await parseOpenAPIFile(openapiPath)
          const generator = new framework.generator(
            openApiDoc,
            tempControllerDir,
            outputFilePath,
            { prettierConfig },
          )
          generator.generate()
        })

        afterAll(() => {
          // Cleanup temp directory
          if (tempOutputDir && fs.existsSync(tempOutputDir)) {
            fs.rmSync(tempOutputDir, { recursive: true, force: true })
          }
        })

        it('should generate the routes file', () => {
          expect(fs.existsSync(outputFilePath)).toBe(true)
        })

        it('should generate file with expected content', () => {
          const expectedPath = path.join(expectedDir, framework.routeFile)

          if (!fs.existsSync(expectedPath)) {
            // Skip if no expected route file exists for this test case
            return
          }

          const expectedContent = readFileNormalized(expectedPath)
          const actualContent = readFileNormalized(outputFilePath)

          if (expectedContent !== actualContent) {
            const diff = generateDiff(expectedContent, actualContent)
            expect.fail(`\nContent differences found:\n${diff}`)
          }
        })
      })
    }
  }
})

