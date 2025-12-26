import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import * as fs from 'node:fs'
import * as path from 'node:path'
import * as os from 'node:os'
import { fileURLToPath } from 'node:url'
import { parseOpenAPIFile } from '../../../src/lib/openapi-parser.js'
import { ControllerGenerator } from '../../../src/lib/controller-generator/index.js'

// Get all test case directories
function getTestCases(e2eDir: string): string[] {
  const entries = fs.readdirSync(e2eDir, { withFileTypes: true })
  return entries
    .filter((entry) => entry.isDirectory() && entry.name !== 'node_modules')
    .map((entry) => entry.name)
}

// Recursively get all files in a directory
function getAllFiles(dir: string, baseDir: string = dir): string[] {
  const files: string[] = []
  const entries = fs.readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...getAllFiles(fullPath, baseDir))
    } else {
      files.push(path.relative(baseDir, fullPath))
    }
  }

  return files.sort()
}

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

const e2eDir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'controller')

describe('Controller Generator E2E Tests', () => {
  const testCases = getTestCases(e2eDir)

  for (const testCase of testCases) {
    describe(`Test case: ${testCase}`, () => {
      const testCaseDir = path.join(e2eDir, testCase)
      const inputDir = path.join(testCaseDir, 'input')
      const expectedDir = path.join(testCaseDir, 'expected')
      let tempOutputDir: string

      beforeAll(async () => {
        // Create temp directory for output
        tempOutputDir = fs.mkdtempSync(
          path.join(os.tmpdir(), `e2e-${testCase}-`)
        )

        // Find OpenAPI file in input directory
        const inputFiles = fs.readdirSync(inputDir)
        const openapiFile = inputFiles.find(
          (f) =>
            f.endsWith('.yaml') ||
            f.endsWith('.yml') ||
            f.endsWith('.json')
        )

        if (!openapiFile) {
          throw new Error(`No OpenAPI file found in ${inputDir}`)
        }

        // Parse and generate
        const openapiPath = path.join(inputDir, openapiFile)
        const openApiDoc = await parseOpenAPIFile(openapiPath)
        const generator = new ControllerGenerator(openApiDoc, tempOutputDir)
        await generator.generate()
      })

      afterAll(() => {
        // Cleanup temp directory
        if (tempOutputDir && fs.existsSync(tempOutputDir)) {
          fs.rmSync(tempOutputDir, { recursive: true, force: true })
        }
      })

      it('should generate the expected files', () => {
        const expectedFiles = getAllFiles(expectedDir)
        const actualFiles = getAllFiles(tempOutputDir)

        const missingFiles = expectedFiles.filter(
          (f) => !actualFiles.includes(f)
        )
        const extraFiles = actualFiles.filter(
          (f) => !expectedFiles.includes(f)
        )

        if (missingFiles.length > 0 || extraFiles.length > 0) {
          const errorParts: string[] = []
          if (missingFiles.length > 0) {
            errorParts.push(`Missing files:\n${missingFiles.map((f) => `  - ${f}`).join('\n')}`)
          }
          if (extraFiles.length > 0) {
            errorParts.push(`Extra files:\n${extraFiles.map((f) => `  + ${f}`).join('\n')}`)
          }
          expect.fail(errorParts.join('\n\n'))
        }
      })

      it('should generate files with expected content', () => {
        const expectedFiles = getAllFiles(expectedDir)
        const differences: string[] = []

        for (const file of expectedFiles) {
          const expectedPath = path.join(expectedDir, file)
          const actualPath = path.join(tempOutputDir, file)

          if (!fs.existsSync(actualPath)) {
            differences.push(`File missing: ${file}`)
            continue
          }

          const expectedContent = readFileNormalized(expectedPath)
          const actualContent = readFileNormalized(actualPath)

          if (expectedContent !== actualContent) {
            const diff = generateDiff(expectedContent, actualContent)
            differences.push(`\n--- ${file} ---\n${diff}`)
          }
        }

        if (differences.length > 0) {
          expect.fail(
            `Content differences found:\n${differences.join('\n')}`
          )
        }
      })
    })
  }
})

