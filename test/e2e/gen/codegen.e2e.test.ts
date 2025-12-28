import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import * as fs from 'node:fs'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
import { runCommand } from './cli-helper'

const e2eDir = path.dirname(fileURLToPath(import.meta.url))
const fixturesDir = path.join(e2eDir, '../fixtures')
const projectRoot = path.resolve(e2eDir, '../../')

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

  let i = 0
  while (i < maxLen) {
    const expLine = expectedLines[i]
    const actLine = actualLines[i]

    if (expLine === actLine) {
      lines.push(`  ${i + 1}: ${expLine ?? ''}`)
      i++
    } else {
      const removedLines: string[] = []
      const addedLines: string[] = []

      while (i < maxLen) {
        const exp = expectedLines[i]
        const act = actualLines[i]

        if (exp === act) {
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

      lines.push(...removedLines, ...addedLines)
    }
  }

  return lines.join('\n')
}

// Recursively get all files in a directory
function getAllFiles(
  dir: string,
  baseDir: string = dir,
  excludePaths: string[] = [],
): string[] {
  const files: string[] = []
  if (!fs.existsSync(dir)) {
    return files
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...getAllFiles(fullPath, baseDir, excludePaths))
    } else {
      const relativePath = path.relative(baseDir, fullPath)
      const normalizedPath = relativePath.split(path.sep).join('/')
      if (!excludePaths.includes(normalizedPath)) {
        files.push(relativePath)
      }
    }
  }

  return files.sort()
}

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

// Framework configurations
const frameworks = [
  {
    name: 'elysia',
    command: 'gen router elysia',
    routeFile: 'elysia-router.gen.ts',
  },
  {
    name: 'express',
    command: 'gen router express',
    routeFile: 'express-router.gen.ts',
  },
  {
    name: 'fastify',
    command: 'gen router fastify',
    routeFile: 'fastify-router.gen.ts',
  },
  {
    name: 'hono',
    command: 'gen router hono',
    routeFile: 'hono-router.gen.ts',
  },
] as const

// Test cases: mitsein allinone and mitsein split
const testCases = [
  {
    name: 'mitsein-allinone',
    inputFile: 'mitsein.allinone.yaml',
  },
  {
    name: 'mitsein-split',
    inputFile: 'mitsein.yaml',
  },
]

describe('Code Generation E2E Tests', () => {
  for (const testCase of testCases) {
    describe(`Test case: ${testCase.name}`, () => {
      const testCaseDir = path.join(fixturesDir, 'mitsein')
      const inputDir = path.join(testCaseDir, 'input')
      const expectedDir = path.join(testCaseDir, 'expected')
      const inputFile = path.join(inputDir, testCase.inputFile)
      let tempOutputDir: string

      beforeAll(async () => {
        // Create temp directory
        const tmpTestDir = path.join(projectRoot, '.tmp-test')
        fs.mkdirSync(tmpTestDir, { recursive: true })
        tempOutputDir = fs.mkdtempSync(
          path.join(tmpTestDir, `codegen-${testCase.name}-`),
        )

        if (!fs.existsSync(inputFile)) {
          throw new Error(`Input file not found: ${inputFile}`)
        }

        // Step 1: Generate controller and shared-types
        console.log(`\n📝 Step 1: Generating controller and shared-types from ${testCase.inputFile}`)
        const controllerFlags: Record<string, any> = {
          outputDir: tempOutputDir,
        }
        if (prettierConfig) {
          controllerFlags.prettier = prettierConfig
        }

        await runCommand('gen controller', [inputFile], controllerFlags)
        console.log(`   ✅ Controller and shared-types generated`)

        // Step 2: Generate router for each framework
        for (const framework of frameworks) {
          console.log(`\n📝 Step 2: Generating ${framework.name} router`)
          const routerFlags: Record<string, any> = {
            outputDir: tempOutputDir,
            controllerFolder: 'controller',
            routerFile: framework.routeFile,
          }
          if (prettierConfig) {
            routerFlags.prettier = prettierConfig
          }

          await runCommand(framework.command, [inputFile], routerFlags)
          console.log(`   ✅ ${framework.name} router generated`)
        }
      })

      afterAll(() => {
        // Keep temp directory for debugging - uncomment to clean up:
        // if (tempOutputDir && fs.existsSync(tempOutputDir)) {
        //   fs.rmSync(tempOutputDir, { recursive: true, force: true })
        // }
        if (tempOutputDir) {
          console.log(`\n   💡 临时文件目录已保留: ${tempOutputDir}`)
        }
      })

      // Test controller files
      it('should generate the expected controller files', () => {
        const expectedControllerDir = path.join(expectedDir, 'controller')
        const actualControllerDir = path.join(tempOutputDir, 'controller')

        const expectedFiles = getAllFiles(expectedControllerDir, expectedControllerDir)
        const actualFiles = fs.existsSync(actualControllerDir)
          ? getAllFiles(actualControllerDir, actualControllerDir)
          : []

        const missingFiles = expectedFiles.filter((f) => !actualFiles.includes(f))
        const extraFiles = actualFiles.filter((f) => !expectedFiles.includes(f))

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
          throw new Error(errorParts.join('\n\n'))
        }
      })

      it('should generate controller files with expected content', () => {
        const expectedControllerDir = path.join(expectedDir, 'controller')
        const actualControllerDir = path.join(tempOutputDir, 'controller')

        const expectedFiles = getAllFiles(expectedControllerDir, expectedControllerDir)
        const differences: string[] = []

        for (const file of expectedFiles) {
          const expectedPath = path.join(expectedControllerDir, file)
          const actualPath = path.join(actualControllerDir, file)

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
          throw new Error(`Content differences found:\n${differences.join('\n')}`)
        }
      })

      // Test shared-types files
      it('should generate the expected shared-types files', () => {
        const expectedSharedTypesDir = path.join(expectedDir, 'shared-types')
        const actualSharedTypesDir = path.join(tempOutputDir, 'shared-types')

        const expectedFiles = getAllFiles(expectedSharedTypesDir, expectedSharedTypesDir)
        const actualFiles = fs.existsSync(actualSharedTypesDir)
          ? getAllFiles(actualSharedTypesDir, actualSharedTypesDir)
          : []

        const missingFiles = expectedFiles.filter((f) => !actualFiles.includes(f))
        const extraFiles = actualFiles.filter((f) => !expectedFiles.includes(f))

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
          throw new Error(errorParts.join('\n\n'))
        }
      })

      it('should generate shared-types files with expected content', () => {
        const expectedSharedTypesDir = path.join(expectedDir, 'shared-types')
        const actualSharedTypesDir = path.join(tempOutputDir, 'shared-types')

        const expectedFiles = getAllFiles(expectedSharedTypesDir, expectedSharedTypesDir)
        const differences: string[] = []

        for (const file of expectedFiles) {
          const expectedPath = path.join(expectedSharedTypesDir, file)
          const actualPath = path.join(actualSharedTypesDir, file)

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
          throw new Error(`Content differences found:\n${differences.join('\n')}`)
        }
      })

      // Test router files for each framework
      for (const framework of frameworks) {
        it(`should generate ${framework.name} router file with expected content`, () => {
          const expectedRouterPath = path.join(expectedDir, framework.routeFile)
          const actualRouterPath = path.join(tempOutputDir, framework.routeFile)

          if (!fs.existsSync(expectedRouterPath)) {
            // Skip if no expected router file exists
            return
          }

          if (!fs.existsSync(actualRouterPath)) {
            throw new Error(`Router file not generated: ${framework.routeFile}`)
          }

          const expectedContent = readFileNormalized(expectedRouterPath)
          const actualContent = readFileNormalized(actualRouterPath)

          if (expectedContent !== actualContent) {
            const diff = generateDiff(expectedContent, actualContent)
            throw new Error(`\nContent differences found in ${framework.routeFile}:\n${diff}`)
          }
        })
      }
    })
  }
})

