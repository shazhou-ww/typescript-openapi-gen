import * as fs from 'node:fs'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
import { runCommand } from '../test/e2e/gen/cli-helper'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '../')
const fixturesDir = path.join(projectRoot, 'test/e2e/fixtures')
const mitseinDir = path.join(fixturesDir, 'mitsein')
const inputDir = path.join(mitseinDir, 'input')
const expectedDir = path.join(mitseinDir, 'expected')

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

async function regenerateExpectedOutput() {
  console.log('🔄 开始重新生成期望输出...\n')

  // Use the first test case (allinone) to generate expected output
  // Both should generate the same output structure
  const testCase = testCases[0]
  const inputFile = path.join(inputDir, testCase.inputFile)
  const tempOutputDir = path.join(projectRoot, '.tmp-regenerate')

  // Clean up temp directory if it exists
  if (fs.existsSync(tempOutputDir)) {
    fs.rmSync(tempOutputDir, { recursive: true, force: true })
  }
  fs.mkdirSync(tempOutputDir, { recursive: true })

  try {
    if (!fs.existsSync(inputFile)) {
      throw new Error(`Input file not found: ${inputFile}`)
    }

    // Step 1: Generate controller and shared-types
    // 使用与测试完全相同的 CLI 命令和参数
    console.log(`📝 Step 1: 生成 controller 和 shared-types...`)
    console.log(`   输入文件: ${inputFile}`)
    const controllerFlags: Record<string, any> = {
      outputDir: tempOutputDir,
    }
    if (prettierConfig) {
      controllerFlags.prettier = prettierConfig
    }

    await runCommand('gen controller', [inputFile], controllerFlags)
    console.log(`   ✅ Controller 和 shared-types 生成完成\n`)

    // Step 2: Generate router for each framework
    // 使用与测试完全相同的 CLI 命令和参数
    for (const framework of frameworks) {
      console.log(`📝 Step 2: 生成 ${framework.name} router...`)
      const routerFlags: Record<string, any> = {
        outputDir: tempOutputDir,
        controllerFolder: 'controller',
        routerFile: framework.routeFile,
      }
      if (prettierConfig) {
        routerFlags.prettier = prettierConfig
      }

      await runCommand(framework.command, [inputFile], routerFlags)
      console.log(`   ✅ ${framework.name} router 生成完成`)
    }
    console.log()

    // Step 3: Copy generated files to expected directory
    // CLI 命令已经处理了格式化，直接复制即可
    console.log(`📋 Step 3: 复制生成的文件到 expected 目录...`)

    // Remove old expected directory
    if (fs.existsSync(expectedDir)) {
      fs.rmSync(expectedDir, { recursive: true, force: true })
    }
    fs.mkdirSync(expectedDir, { recursive: true })

    // Copy controller directory
    const tempControllerDir = path.join(tempOutputDir, 'controller')
    const expectedControllerDir = path.join(expectedDir, 'controller')
    if (fs.existsSync(tempControllerDir)) {
      fs.cpSync(tempControllerDir, expectedControllerDir, { recursive: true })
      console.log(`   ✅ 复制 controller 目录`)
    }

    // Copy shared-types directory
    const tempSharedTypesDir = path.join(tempOutputDir, 'shared-types')
    const expectedSharedTypesDir = path.join(expectedDir, 'shared-types')
    if (fs.existsSync(tempSharedTypesDir)) {
      fs.cpSync(tempSharedTypesDir, expectedSharedTypesDir, { recursive: true })
      console.log(`   ✅ 复制 shared-types 目录`)
    }

    // Copy router files
    for (const framework of frameworks) {
      const tempRouterFile = path.join(tempOutputDir, framework.routeFile)
      const expectedRouterFile = path.join(expectedDir, framework.routeFile)
      if (fs.existsSync(tempRouterFile)) {
        fs.copyFileSync(tempRouterFile, expectedRouterFile)
        console.log(`   ✅ 复制 ${framework.routeFile}`)
      }
    }

    console.log(`\n✅ 期望输出重新生成完成！`)
    console.log(`   输出目录: ${expectedDir}`)
    console.log(`   注意: 文件已通过 CLI 命令格式化，无需额外格式化`)
    console.log(`   临时文件目录: ${tempOutputDir} (已保留以便检查)`)
  } catch (error) {
    console.error('❌ 重新生成期望输出时出错:')
    if (error instanceof Error) {
      console.error(`   ${error.message}`)
      if ((error as any).stdout) {
        console.error(`\nSTDOUT:\n${(error as any).stdout}`)
      }
      if ((error as any).stderr) {
        console.error(`\nSTDERR:\n${(error as any).stderr}`)
      }
    } else {
      console.error(`   ${String(error)}`)
    }
    console.log(`   临时文件目录: ${tempOutputDir} (已保留以便检查)`)
    process.exit(1)
  }
  // Note: Temp directory is kept for inspection
  // Uncomment the following to clean up:
  // if (fs.existsSync(tempOutputDir)) {
  //   fs.rmSync(tempOutputDir, { recursive: true, force: true })
  // }
}

regenerateExpectedOutput()

