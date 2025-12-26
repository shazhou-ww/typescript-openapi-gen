import { Args, Command, Flags } from '@oclif/core'
import * as fs from 'node:fs'
import * as path from 'node:path'
import { parseOpenAPIFile } from '../../../lib/openapi-parser.js'
import { ElysiaRouteGenerator } from '../../../lib/route-generator/index.js'

export default class GenRouteElysia extends Command {
  static override args = {
    file: Args.string({
      description: 'OpenAPI specification file (YAML or JSON)',
      required: true,
    }),
  }

  static override description =
    'Generate Elysia routes from OpenAPI specification'

  static override examples = [
    '<%= config.bin %> <%= command.id %> --controller ./controller --output ./routes.ts openapi.yaml',
    '<%= config.bin %> <%= command.id %> -c ./src/controllers -o ./src/routes/elysia.ts --prettier .prettierrc api.json',
  ]

  static override flags = {
    controller: Flags.string({
      char: 'c',
      description: 'Path to the generated controller directory',
      required: true,
    }),
    output: Flags.string({
      char: 'o',
      description: 'Output file path for generated routes',
      required: true,
    }),
    prettier: Flags.string({
      description: 'Path to prettier config file for formatting output',
      required: false,
    }),
  }

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(GenRouteElysia)

    const inputFile = path.resolve(args.file)
    const controllerPath = path.resolve(flags.controller)
    const outputPath = path.resolve(flags.output)
    const prettierConfig = flags.prettier
      ? path.resolve(flags.prettier)
      : undefined

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
      const generator = new ElysiaRouteGenerator(
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
