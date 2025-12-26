import { Args, Command, Flags } from '@oclif/core'
import * as fs from 'node:fs'
import * as path from 'node:path'
import { parseOpenAPIFile } from '../../lib/openapi-parser.js'
import { ControllerGenerator } from '../../lib/controller-generator/index.js'
import { FastifyRouteGenerator } from '../../lib/route-generator/index.js'

export default class GenFastify extends Command {
  static override args = {
    file: Args.string({
      description: 'OpenAPI specification file (YAML or JSON)',
      required: true,
    }),
  }

  static override description =
    'Generate Fastify app (controllers + routes) from OpenAPI specification'

  static override examples = [
    '<%= config.bin %> <%= command.id %> --output-dir ./src openapi.yaml',
    '<%= config.bin %> <%= command.id %> -o ./src --controller-folder handlers --route-file routes.ts api.json',
  ]

  static override flags = {
    'output-dir': Flags.string({
      char: 'o',
      description: 'Output directory for generated files',
      required: true,
    }),
    'controller-folder': Flags.string({
      description: 'Subfolder name for controllers (default: controller)',
      required: false,
    }),
    'shared-types-folder': Flags.string({
      description: 'Subfolder name for shared types (default: shared-types)',
      required: false,
    }),
    'route-file': Flags.string({
      description: 'Route file name (default: fastify-routes.ts)',
      required: false,
    }),
    prettier: Flags.string({
      description: 'Path to prettier config file for formatting output',
      required: false,
    }),
  }

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(GenFastify)

    const inputFile = path.resolve(args.file)
    const outputDir = path.resolve(flags['output-dir'])
    const controllerFolder = flags['controller-folder'] ?? 'controller'
    const sharedTypesFolder = flags['shared-types-folder'] ?? 'shared-types'
    const routeFile = flags['route-file'] ?? 'fastify-routes.ts'
    const prettierConfig = flags.prettier
      ? path.resolve(flags.prettier)
      : undefined

    // Check if input file exists
    if (!fs.existsSync(inputFile)) {
      this.error(`Input file not found: ${inputFile}`)
    }

    // Check if prettier config exists (if provided)
    if (prettierConfig && !fs.existsSync(prettierConfig)) {
      this.error(`Prettier config file not found: ${prettierConfig}`)
    }

    this.log(`Parsing OpenAPI file: ${inputFile}`)

    try {
      // Parse OpenAPI file
      const openApiDoc = await parseOpenAPIFile(inputFile)

      // Step 1: Generate controllers
      this.log('\n📁 Generating controllers...')
      const controllerGenerator = new ControllerGenerator(openApiDoc, outputDir, {
        prettierConfig,
        controllerFolder,
        sharedTypesFolder,
      })
      const controllerResult = await controllerGenerator.generate()

      this.log(`   Controllers generated: ${controllerResult.controllersGenerated}`)
      this.log(`   Files created: ${controllerResult.filesCreated}`)
      this.log(`   Files skipped (already exist): ${controllerResult.filesSkipped}`)
      if (controllerResult.filesFormatted > 0) {
        this.log(`   Files formatted with prettier: ${controllerResult.filesFormatted}`)
      }

      // Step 2: Generate routes
      this.log('\n🛣️  Generating routes...')
      const controllerPath = path.join(outputDir, controllerFolder)
      const outputPath = path.join(outputDir, routeFile)

      const routeGenerator = new FastifyRouteGenerator(
        openApiDoc,
        controllerPath,
        outputPath,
        { prettierConfig },
      )
      const routeResult = routeGenerator.generate()

      this.log(`   Routes generated: ${routeResult.routesGenerated}`)
      if (routeResult.fileFormatted) {
        this.log(`   Formatted with prettier: yes`)
      }

      // Summary
      this.log(`\n✅ Generation complete!`)
      this.log(`   Output directory: ${outputDir}`)
      this.log(`   Controller folder: ${controllerFolder}/`)
      this.log(`   Shared types folder: ${sharedTypesFolder}/`)
      this.log(`   Route file: ${routeFile}`)

      // Warnings
      const allErrors = [...controllerResult.errors, ...routeResult.errors]
      if (allErrors.length > 0) {
        this.warn('\n⚠️ Warnings:')
        for (const error of allErrors) {
          this.warn(`   - ${error}`)
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        this.error(`Failed to generate: ${error.message}`)
      }
      throw error
    }
  }
}
