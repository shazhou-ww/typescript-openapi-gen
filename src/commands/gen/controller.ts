import { Command } from 'commander'
import * as fs from 'node:fs'
import * as path from 'node:path'
import { parseOpenAPIFile } from '../../lib/openapi-parser'
import { ControllerGenerator } from '../../lib/controller-generator'

function registerControllerCommand(program: Command) {
  program
    .command('controller')
    .description('Generate controller skeleton code from OpenAPI specification')
    .argument('<file>', 'OpenAPI specification file (YAML or JSON)')
    .requiredOption('-o, --output-dir <path>', 'Output directory for generated files')
    .option('--controller-folder <name>', 'Subfolder name for controllers (default: controller)')
    .option('--shared-types-folder <name>', 'Subfolder name for shared types (default: shared-types)')
    .option('--prettier <path>', 'Path to prettier config file for formatting output')
    .action(async (file: string, options: {
      outputDir: string
      controllerFolder?: string
      sharedTypesFolder?: string
      prettier?: string
    }) => {
      const inputFile = path.resolve(file)
      const outputDir = path.resolve(options.outputDir)
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

        // Generate controllers
        const generator = new ControllerGenerator(openApiDoc, outputDir, {
          prettierConfig,
          controllerFolder: options.controllerFolder,
          sharedTypesFolder: options.sharedTypesFolder,
        })
        const result = await generator.generate()

        console.log(`\n✅ Generation complete!`)
        console.log(`   Controllers generated: ${result.controllersGenerated}`)
        console.log(`   Files created: ${result.filesCreated}`)
        console.log(`   Files skipped (already exist): ${result.filesSkipped}`)
        if (result.filesFormatted > 0) {
          console.log(`   Files formatted with prettier: ${result.filesFormatted}`)
        }
        console.log(`   Output directory: ${outputDir}`)

        if (result.errors.length > 0) {
          console.warn('\n⚠️ Warnings:')
          for (const error of result.errors) {
            console.warn(`   - ${error}`)
          }
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error(`Failed to generate controllers: ${error.message}`)
        } else {
          console.error(`Failed to generate controllers: ${String(error)}`)
        }
        process.exit(1)
      }
    })
}

export default registerControllerCommand
