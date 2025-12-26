import { Args, Command, Flags } from '@oclif/core'
import * as fs from 'node:fs'
import * as path from 'node:path'
import { parseOpenAPIFile } from '../../../lib/openapi-parser.js'
import { HonoRouteGenerator } from '../../../lib/route-generator/index.js'

export default class GenRouterHono extends Command {
  static override args = {
    file: Args.string({
      description: 'OpenAPI specification file (YAML or JSON)',
      required: true,
    }),
  }

  static override description = 'Generate Hono router decorator from OpenAPI specification'

  static override examples = [
    '<%= config.bin %> <%= command.id %> --output-dir ./src openapi.yaml',
    '<%= config.bin %> <%= command.id %> -o ./src --router-file router.ts --controller-folder handlers api.json',
  ]

  static override flags = {
    'output-dir': Flags.string({
      char: 'o',
      description: 'Output directory (same as controller generation)',
      required: true,
    }),
    'router-file': Flags.string({
      description: 'Router file name (default: hono-router.ts)',
      required: false,
    }),
    'controller-folder': Flags.string({
      description: 'Controller subfolder name (default: controller)',
      required: false,
    }),
    prettier: Flags.string({
      description: 'Path to prettier config file for formatting output',
      required: false,
    }),
  }

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(GenRouterHono)

    const inputFile = path.resolve(args.file)
    const outputDir = path.resolve(flags['output-dir'])
    const controllerFolder = flags['controller-folder'] ?? 'controller'
    const routerFile = flags['router-file'] ?? 'hono-router.ts'
    const prettierConfig = flags.prettier
      ? path.resolve(flags.prettier)
      : undefined

    const controllerPath = path.join(outputDir, controllerFolder)
    const outputPath = path.join(outputDir, routerFile)

    // Check if input file exists
    if (!fs.existsSync(inputFile)) {
      this.error(`Input file not found: ${inputFile}`)
    }

    // Check if controller directory exists
    if (!fs.existsSync(controllerPath)) {
      this.error(`Controller directory not found: ${controllerPath}`)
    }

    // Check if prettier config exists (if provided)
    if (prettierConfig && !fs.existsSync(prettierConfig)) {
      this.error(`Prettier config file not found: ${prettierConfig}`)
    }

    this.log(`Parsing OpenAPI file: ${inputFile}`)

    try {
      // Parse OpenAPI file
      const openApiDoc = await parseOpenAPIFile(inputFile)

      // Generate routes
      const generator = new HonoRouteGenerator(
        openApiDoc,
        controllerPath,
        outputPath,
        { prettierConfig },
      )
      const result = generator.generate()

      this.log(`\n✅ Generation complete!`)
      this.log(`   Routes generated: ${result.routesGenerated}`)
      if (result.fileFormatted) {
        this.log(`   Formatted with prettier: yes`)
      }
      this.log(`   Output file: ${outputPath}`)

      if (result.errors.length > 0) {
        this.warn('\n⚠️ Warnings:')
        for (const error of result.errors) {
          this.warn(`   - ${error}`)
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        this.error(`Failed to generate routes: ${error.message}`)
      }
      throw error
    }
  }
}

