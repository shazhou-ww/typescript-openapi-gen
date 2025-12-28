import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import * as fs from 'node:fs'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
import { runCommand } from './cli-helper'

// This test file is kept for backward compatibility
// New tests should use route-all-frameworks.e2e.test.ts

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

// Uses the same test cases as controller tests
const e2eDir = path.dirname(fileURLToPath(import.meta.url))
const fixturesDir = path.join(e2eDir, '../fixtures')

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

describe('Route Generator E2E Tests', () => {
  const testCases = getTestCases()

  for (const testCase of testCases) {
    describe(`Test case: ${testCase}`, () => {
      const testCaseDir = path.join(fixturesDir, testCase)
      const inputDir = path.join(testCaseDir, 'input')
      const expectedDir = path.join(testCaseDir, 'expected')
      let tempOutputDir: string
      let outputFilePath: string

      beforeAll(async () => {
        // Create temp directory in project folder
        const projectRoot = path.resolve(e2eDir, '../../')
        const tmpTestDir = path.join(projectRoot, '.tmp-test')
        fs.mkdirSync(tmpTestDir, { recursive: true })
        tempOutputDir = fs.mkdtempSync(
          path.join(tmpTestDir, `route-${testCase}-`),
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
        fs.cpSync(expectedControllerDir, tempControllerDir, { recursive: true })

        // Call CLI command to generate routes
        const openapiPath = path.join(inputDir, openapiFile)
        outputFilePath = path.join(tempOutputDir, 'elysia-router.gen.ts')

        // Find prettier config
        const prettierConfig = path.join(projectRoot, '.prettierrc')
        const flags: Record<string, any> = {
          outputDir: tempOutputDir,
          controllerFolder: 'controller',
          routerFile: 'elysia-router.gen.ts',
        }
        if (fs.existsSync(prettierConfig)) {
          flags.prettier = prettierConfig
        }

        await runCommand('gen router elysia', [openapiPath], flags)
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
        const expectedPath = path.join(expectedDir, 'elysia-router.gen.ts')

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
