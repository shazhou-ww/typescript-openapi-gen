import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import * as fs from 'node:fs'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
import { runCommand } from './cli-helper'

// Get all test case directories (directories with input/expected subdirs)
function getTestCases(e2eDir: string): string[] {
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

// Recursively get all files in a directory, excluding specified relative paths
function getAllFiles(
  dir: string,
  baseDir: string = dir,
  excludePaths: string[] = [],
): string[] {
  const files: string[] = []
  const entries = fs.readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...getAllFiles(fullPath, baseDir, excludePaths))
    } else {
      const relativePath = path.relative(baseDir, fullPath)
      // Normalize path separators for comparison
      const normalizedPath = relativePath.split(path.sep).join('/')
      if (!excludePaths.includes(normalizedPath)) {
        files.push(relativePath)
      }
    }
  }

  return files.sort()
}

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

describe('Controller Generator E2E Tests', () => {
  const testCases = getTestCases(fixturesDir)

  for (const testCase of testCases) {
    describe(`Test case: ${testCase}`, () => {
      const testCaseDir = path.join(fixturesDir, testCase)
      const inputDir = path.join(testCaseDir, 'input')
      const expectedBaseDir = path.join(testCaseDir, 'expected')
      let tempOutputDir: string

      beforeAll(async () => {
        // Create temp directory in system temp folder
        const os = await import('node:os')
        tempOutputDir = fs.mkdtempSync(
          path.join(os.tmpdir(), `typescript-openapi-gen-${testCase}-`),
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

        // Call CLI command to generate controllers
        const openapiPath = path.join(inputDir, openapiFile)
        const flags: Record<string, any> = {
          outputDir: tempOutputDir,
        }
        if (prettierConfig) {
          flags.prettier = prettierConfig
        }

        await runCommand('gen controller', [openapiPath], flags)
      })

      afterAll(() => {
        // Cleanup temp directory
        if (tempOutputDir && fs.existsSync(tempOutputDir)) {
          fs.rmSync(tempOutputDir, { recursive: true, force: true })
        }
      })

      // Test both controller and shared-types directories
      const subfolders = ['controller', 'shared-types']

      for (const subfolder of subfolders) {
        it(`should generate the expected ${subfolder} files`, () => {
          const expectedDir = path.join(expectedBaseDir, subfolder)
          const actualDir = path.join(tempOutputDir, subfolder)

          const expectedFiles = getAllFiles(expectedDir, expectedDir)
          const actualFiles = fs.existsSync(actualDir)
            ? getAllFiles(actualDir, actualDir)
            : []

        const missingFiles = expectedFiles.filter(
            (f) => !actualFiles.includes(f),
        )
        const extraFiles = actualFiles.filter(
            (f) => !expectedFiles.includes(f),
        )

        if (missingFiles.length > 0 || extraFiles.length > 0) {
          const errorParts: string[] = []
          if (missingFiles.length > 0) {
              errorParts.push(
                `Missing files:\n${missingFiles.map((f) => `  - ${f}`).join('\n')}`,
              )
          }
          if (extraFiles.length > 0) {
              errorParts.push(
                `Extra files:\n${extraFiles.map((f) => `  + ${f}`).join('\n')}`,
              )
          }
          expect.fail(errorParts.join('\n\n'))
        }
      })

        it(`should generate ${subfolder} files with expected content`, () => {
          const expectedDir = path.join(expectedBaseDir, subfolder)
          const actualDir = path.join(tempOutputDir, subfolder)

          const expectedFiles = getAllFiles(expectedDir, expectedDir)
        const differences: string[] = []

        for (const file of expectedFiles) {
          const expectedPath = path.join(expectedDir, file)
            const actualPath = path.join(actualDir, file)

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
            expect.fail(`Content differences found:\n${differences.join('\n')}`)
        }
      })
      }
    })
  }
})
