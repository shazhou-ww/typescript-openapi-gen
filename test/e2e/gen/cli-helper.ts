import { spawn } from 'node:child_process'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../')
// Use run.js to run from built files
const binPath = path.join(projectRoot, 'bin', 'run.js')

/**
 * Run a CLI command by spawning a subprocess
 * This is the proper way to test CLI commands in e2e tests
 */
export async function runCommand(
  commandId: string,
  args: string[],
  flags: Record<string, any> = {},
): Promise<void> {
  // Build command arguments
  const commandArgs: string[] = [commandId]

  // Add flags (convert camelCase to kebab-case)
  for (const [key, value] of Object.entries(flags)) {
    if (value !== undefined && value !== null) {
      // Convert camelCase to kebab-case (e.g., outputDir -> output-dir)
      const flagName = key.replace(/([A-Z])/g, '-$1').toLowerCase()
      if (typeof value === 'boolean') {
        if (value) {
          commandArgs.push(`--${flagName}`)
        }
      } else {
        commandArgs.push(`--${flagName}`, String(value))
      }
    }
  }

  // Add positional args
  commandArgs.push(...args)

  return new Promise((resolve, reject) => {
    const child = spawn('node', [binPath, ...commandArgs], {
      cwd: projectRoot,
      stdio: 'pipe',
    })

    let stdout = ''
    let stderr = ''

    child.stdout?.on('data', (data) => {
      stdout += data.toString()
    })

    child.stderr?.on('data', (data) => {
      stderr += data.toString()
    })

    child.on('close', (code) => {
      if (code === 0) {
        resolve()
      } else {
        const error = new Error(
          `Command failed with exit code ${code}\nSTDOUT:\n${stdout}\nSTDERR:\n${stderr}`,
        )
        ;(error as any).code = code
        ;(error as any).stdout = stdout
        ;(error as any).stderr = stderr
        reject(error)
      }
    })

    child.on('error', (error) => {
      reject(error)
    })
  })
}

