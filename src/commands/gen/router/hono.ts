import { Command } from 'commander'
import * as fs from 'node:fs'
import * as path from 'node:path'
import { parseOpenAPIFile } from '../../../lib/openapi-parser'
import { HonoRouteGenerator } from '../../../lib/route-generator'

function registerRouterHonoCommand(program: Command) {
  program
    .command('hono')
    .description('Generate Hono router decorator from OpenAPI specification')
    .argument('<file>', 'OpenAPI specification file (YAML or JSON)')
    .requiredOption('-o, --output-dir <path>', 'Output directory (same as controller generation)')
    .option('--router-file <name>', 'Router file name (default: hono-router.gen.ts)')
    .option('--controller-folder <name>', 'Controller subfolder name (default: controller)')
    .option('--prettier <path>', 'Path to prettier config file for formatting output')
    .action(async (file: string, options: {
      outputDir: string
      routerFile?: string
      controllerFolder?: string
      prettier?: string
    }) => {
      const inputFile = path.resolve(file)
      const outputDir = path.resolve(options.outputDir)
      const controllerFolder = options.controllerFolder ?? 'controller'
      const routerFile = options.routerFile ?? 'hono-router.gen.ts'
      const prettierConfig = options.prettier
        ? path.resolve(options.prettier)
        : undefined
      const controllerPath = path.join(outputDir, controllerFolder)
      const outputPath = path.join(outputDir, routerFile)

      // Check if input file exists
      if (!fs.existsSync(inputFile)) {
        console.error(`Input file not found: ${inputFile}`)
        process.exit(1)
      }

      // Check if controller directory exists
      if (!fs.existsSync(controllerPath)) {
        console.error(`Controller directory not found: ${controllerPath}`)
        process.exit(1)
      }

      // Check if prettier config exists (if provided)
      if (prettierConfig && !fs.existsSync(prettierConfig)) {
        console.error(`Prettier config file not found: ${prettierConfig}`)
        process.exit(1)
      }

      console.log(`Parsing OpenAPI file: ${inputFile}`)

      try {
        // Parse OpenAPI file
        const openApiDoc = await parseOpenAPIFile(inputFile)

        // Generate routes
        const generator = new HonoRouteGenerator(openApiDoc, controllerPath, outputPath, {
          prettierConfig,
        })
        const result = generator.generate()

        console.log(`\n✅ Generation complete!`)
        console.log(`   Routes generated: ${result.routesGenerated}`)
        if (result.fileFormatted) {
          console.log(`   Formatted with prettier: yes`)
        }
        console.log(`   Output file: ${outputPath}`)

        if (result.errors.length > 0) {
          console.warn('\n⚠️ Warnings:')
          for (const error of result.errors) {
            console.warn(`   - ${error}`)
          }
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error(`Failed to generate routes: ${error.message}`)
        } else {
          console.error(`Failed to generate routes: ${String(error)}`)
        }
        process.exit(1)
      }
    })
}

module.exports = registerRouterHonoCommand

