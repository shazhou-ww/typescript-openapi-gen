import * as fs from 'node:fs'
import * as path from 'node:path'
import { execSync } from 'node:child_process'

// Common prettier config file names
const PRETTIER_CONFIG_FILES = [
  '.prettierrc',
  '.prettierrc.json',
  '.prettierrc.yml',
  '.prettierrc.yaml',
  '.prettierrc.json5',
  '.prettierrc.js',
  '.prettierrc.cjs',
  '.prettierrc.mjs',
  'prettier.config.js',
  'prettier.config.cjs',
  'prettier.config.mjs',
  '.prettierrc.toml',
]

/**
 * Find the project root by looking for package.json
 */
function findProjectRoot(startDir: string): string | null {
  let currentDir = path.resolve(startDir)
  const root = path.parse(currentDir).root

  while (currentDir !== root) {
    if (fs.existsSync(path.join(currentDir, 'package.json'))) {
      return currentDir
    }
    currentDir = path.dirname(currentDir)
  }

  return null
}

/**
 * Check if prettier is configured in the project
 */
function findPrettierConfig(projectRoot: string): string | null {
  // Check for standalone config files
  for (const configFile of PRETTIER_CONFIG_FILES) {
    const configPath = path.join(projectRoot, configFile)
    if (fs.existsSync(configPath)) {
      return configPath
    }
  }

  // Check for prettier key in package.json
  const packageJsonPath = path.join(projectRoot, 'package.json')
  if (fs.existsSync(packageJsonPath)) {
    try {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
      if (packageJson.prettier) {
        // If prettier config is in package.json, we don't need --config flag
        return packageJsonPath
      }
    } catch {
      // Ignore parse errors
    }
  }

  return null
}

/**
 * Check if prettier is available (installed)
 */
function isPrettierAvailable(projectRoot: string): boolean {
  const prettierPath = path.join(
    projectRoot,
    'node_modules',
    '.bin',
    'prettier',
  )
  const prettierPathCmd = path.join(
    projectRoot,
    'node_modules',
    '.bin',
    'prettier.cmd',
  )

  return fs.existsSync(prettierPath) || fs.existsSync(prettierPathCmd)
}

/**
 * Format a file using prettier
 * @param filePath - Path to the file to format
 * @param prettierConfig - Optional path to prettier config file. If not provided, auto-detect.
 * @returns true if file was formatted, false otherwise
 */
export function formatFileWithPrettier(
  filePath: string,
  prettierConfig?: string,
): boolean {
  const absolutePath = path.resolve(filePath)

  // If config is provided, use it directly
  if (prettierConfig) {
    const absoluteConfig = path.resolve(prettierConfig)
    if (!fs.existsSync(absoluteConfig)) {
      return false
    }

    const projectRoot = findProjectRoot(path.dirname(absoluteConfig))
    if (!projectRoot || !isPrettierAvailable(projectRoot)) {
      return false
    }

    try {
      execSync(
        `npx prettier --write --config "${absoluteConfig}" "${absolutePath}"`,
        { cwd: projectRoot, stdio: 'pipe' },
      )
      return true
    } catch {
      return false
    }
  }

  // Auto-detect mode
  const projectRoot = findProjectRoot(path.dirname(absolutePath))
  if (!projectRoot) {
    return false
  }

  const detectedConfig = findPrettierConfig(projectRoot)
  if (!detectedConfig || !isPrettierAvailable(projectRoot)) {
    return false
  }

  try {
    // If config is in package.json, don't use --config flag
    if (detectedConfig.endsWith('package.json')) {
      execSync(`npx prettier --write "${absolutePath}"`, {
        cwd: projectRoot,
        stdio: 'pipe',
      })
    } else {
      execSync(
        `npx prettier --write --config "${detectedConfig}" "${absolutePath}"`,
        { cwd: projectRoot, stdio: 'pipe' },
      )
    }
    return true
  } catch {
    return false
  }
}

/**
 * Format multiple files using prettier
 * @param filePaths - Paths to the files to format
 * @param prettierConfig - Optional path to prettier config file. If not provided, auto-detect.
 * @returns number of files formatted
 */
export function formatFilesWithPrettier(
  filePaths: string[],
  prettierConfig?: string,
): number {
  if (filePaths.length === 0) {
    return 0
  }

  const absolutePaths = filePaths.map((p) => path.resolve(p))

  // If config is provided, use it directly
  if (prettierConfig) {
    const absoluteConfig = path.resolve(prettierConfig)
    if (!fs.existsSync(absoluteConfig)) {
      return 0
    }

    const projectRoot = findProjectRoot(path.dirname(absoluteConfig))
    if (!projectRoot || !isPrettierAvailable(projectRoot)) {
      return 0
    }

    try {
      const fileList = absolutePaths.map((p) => `"${p}"`).join(' ')
      execSync(`npx prettier --write --config "${absoluteConfig}" ${fileList}`, {
        cwd: projectRoot,
        stdio: 'pipe',
      })
      return filePaths.length
    } catch {
      return 0
    }
  }

  // Auto-detect mode
  const projectRoot = findProjectRoot(path.dirname(absolutePaths[0]))
  if (!projectRoot) {
    return 0
  }

  const detectedConfig = findPrettierConfig(projectRoot)
  if (!detectedConfig || !isPrettierAvailable(projectRoot)) {
    return 0
  }

  try {
    const fileList = absolutePaths.map((p) => `"${p}"`).join(' ')
    // If config is in package.json, don't use --config flag
    if (detectedConfig.endsWith('package.json')) {
      execSync(`npx prettier --write ${fileList}`, {
        cwd: projectRoot,
        stdio: 'pipe',
      })
    } else {
      execSync(
        `npx prettier --write --config "${detectedConfig}" ${fileList}`,
        { cwd: projectRoot, stdio: 'pipe' },
      )
    }
    return filePaths.length
  } catch {
    return 0
  }
}
