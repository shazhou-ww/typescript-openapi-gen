import { Command } from 'commander'
import * as fs from 'node:fs'
import * as path from 'node:path'
import { parseOpenAPIFile } from '../../lib/openapi-parser'
import { ControllerGenerator } from '../../lib/controller-generator'
import { HonoRouteGenerator } from '../../lib/route-generator'

function registerHonoCommand(program: Command) {
  program
    .command('hono')
    .description('Generate Hono app (controllers + routes) from OpenAPI specification')
    .argument('<file>', 'OpenAPI specification file (YAML or JSON)')
    .requiredOption('-o, --output-dir <path>', 'Output directory for generated files')
    .option('--controller-folder <name>', 'Subfolder name for controllers (default: controller)')
    .option('--shared-types-folder <name>', 'Subfolder name for shared types (default: shared-types)')
    .option('--route-file <name>', 'Route file name (default: hono-routes.ts)')
    .option('--prettier <path>', 'Path to prettier config file for formatting output')
    .action(async (file: string, options: {
      outputDir: string
      controllerFolder?: string
      sharedTypesFolder?: string
      routeFile?: string
      prettier?: string
    }) => {
      const inputFile = path.resolve(file)
      const outputDir = path.resolve(options.outputDir)
      const controllerFolder = options.controllerFolder ?? 'controller'
      const sharedTypesFolder = options.sharedTypesFolder ?? 'shared-types'
      const routeFile = options.routeFile ?? 'hono-routes.ts'
      const prettierConfig = options.prettier
        ? path.resolve(options.prettier)
        : undefined

      // Check if input file exists
      if (!fs.existsSync(inputFile)) {
        console.error(`Input file not found: ${inputFile}`)
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

        // Step 1: Generate controllers
        console.log('\n📁 Generating controllers...')
        const controllerGenerator = new ControllerGenerator(openApiDoc, outputDir, {
          prettierConfig,
          controllerFolder,
          sharedTypesFolder,
        })
        const controllerResult = await controllerGenerator.generate()
        console.log(`   Controllers generated: ${controllerResult.controllersGenerated}`)
        console.log(`   Files created: ${controllerResult.filesCreated}`)
        console.log(`   Files skipped (already exist): ${controllerResult.filesSkipped}`)
        if (controllerResult.filesFormatted > 0) {
          console.log(`   Files formatted with prettier: ${controllerResult.filesFormatted}`)
        }

        // Step 2: Generate routes
        console.log('\n🛣️  Generating routes...')
        const controllerPath = path.join(outputDir, controllerFolder)
        const outputPath = path.join(outputDir, routeFile)
        const routeGenerator = new HonoRouteGenerator(openApiDoc, controllerPath, outputPath, {
          prettierConfig,
        })
        const routeResult = routeGenerator.generate()
        console.log(`   Routes generated: ${routeResult.routesGenerated}`)
        if (routeResult.fileFormatted) {
          console.log(`   Formatted with prettier: yes`)
        }

        // Summary
        console.log(`\n✅ Generation complete!`)
        console.log(`   Output directory: ${outputDir}`)
        console.log(`   Controller folder: ${controllerFolder}/`)
        console.log(`   Shared types folder: ${sharedTypesFolder}/`)
        console.log(`   Route file: ${routeFile}`)

        // Warnings
        const allErrors = [...controllerResult.errors, ...routeResult.errors]
        if (allErrors.length > 0) {
          console.warn('\n⚠️ Warnings:')
          for (const error of allErrors) {
            console.warn(`   - ${error}`)
          }
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error(`Failed to generate: ${error.message}`)
        } else {
          console.error(`Failed to generate: ${String(error)}`)
        }
        process.exit(1)
      }
    })
}

export default registerHonoCommand

