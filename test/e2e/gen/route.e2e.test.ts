import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import * as fs from 'node:fs'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseOpenAPIFile } from '../../../src/lib/openapi-parser.js'
import { ElysiaRouteGenerator } from '../../../src/lib/route-generator/index.js'

// This test file is kept for backward compatibility
// New tests should use route-all-frameworks.e2e.test.ts

// Read file content with normalized line endings
function readFileNormalized(filePath: string): string {
  return fs.readFileSync(filePath, 'utf-8').replace(/\r\n/g, '\n')
}

// Generate a diff-like output for two strings
function generateDiff(expected: string, actual: string): string {
  const expectedLines = expected.split('\n')
  const actualLines = actual.split('\n')
  const lines: string[] = []
  const maxLen = Math.max(expectedLines.length, actualLines.length)

  for (let i = 0; i < maxLen; i++) {
    const expLine = expectedLines[i]
    const actLine = actualLines[i]

    if (expLine === actLine) {
      lines.push(`  ${i + 1}: ${expLine ?? ''}`)
    } else {
      if (expLine !== undefined) {
        lines.push(`- ${i + 1}: ${expLine}`)
      }
      if (actLine !== undefined) {
        lines.push(`+ ${i + 1}: ${actLine}`)
      }
    }
  }

  return lines.join('\n')
}

// Uses the same test cases as controller tests
const e2eDir = path.dirname(fileURLToPath(import.meta.url))

// Get all test case directories (directories with input/expected subdirs)
function getTestCases(): string[] {
  const entries = fs.readdirSync(e2eDir, { withFileTypes: true })
  return entries
    .filter((entry) => {
      if (!entry.isDirectory()) return false
      // Check if it has input and expected subdirectories
      const hasInput = fs.existsSync(path.join(e2eDir, entry.name, 'input'))
      const hasExpected = fs.existsSync(
        path.join(e2eDir, entry.name, 'expected'),
      )
      return hasInput && hasExpected
    })
    .map((entry) => entry.name)
}

describe('Route Generator E2E Tests', () => {
  const testCases = getTestCases()

  for (const testCase of testCases) {
    describe(`Test case: ${testCase}`, () => {
      const testCaseDir = path.join(e2eDir, testCase)
      const inputDir = path.join(testCaseDir, 'input')
      const expectedDir = path.join(testCaseDir, 'expected')
      let tempOutputDir: string
      let outputFilePath: string

      beforeAll(async () => {
        // Create temp directory for output in the same location as test cases
        // This ensures relative paths work correctly
        tempOutputDir = fs.mkdtempSync(path.join(testCaseDir, `temp-route-`))

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
        fs.cpSync(expectedControllerDir, tempControllerDir, { recursive: true })

        // Parse and generate routes
        const openapiPath = path.join(inputDir, openapiFile)
        outputFilePath = path.join(tempOutputDir, 'elysia-routes.ts')

        const openApiDoc = await parseOpenAPIFile(openapiPath)
        const generator = new ElysiaRouteGenerator(
          openApiDoc,
          tempControllerDir,
          outputFilePath,
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
        const expectedPath = path.join(expectedDir, 'elysia-routes.ts')

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
})
