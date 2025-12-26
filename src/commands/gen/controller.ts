import { Args, Command, Flags } from '@oclif/core'
import * as fs from 'node:fs'
import * as path from 'node:path'
import { parseOpenAPIFile } from '../../lib/openapi-parser.js'
import { ControllerGenerator } from '../../lib/controller-generator/index.js'

export default class GenController extends Command {
  static override args = {
    file: Args.string({
      description: 'OpenAPI specification file (YAML or JSON)',
      required: true,
    }),
  }

  static override description =
    'Generate controller skeleton code from OpenAPI specification'

  static override examples = [
    '<%= config.bin %> <%= command.id %> --output ./controllers openapi.yaml',
    '<%= config.bin %> <%= command.id %> -o ./src/controllers --prettier .prettierrc api.json',
  ]

  static override flags = {
    output: Flags.string({
      char: 'o',
      description: 'Output directory for generated controllers',
      required: true,
    }),
    prettier: Flags.string({
      description: 'Path to prettier config file for formatting output',
      required: false,
    }),
  }

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(GenController)

    const inputFile = path.resolve(args.file)
    const outputDir = path.resolve(flags.output)
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

      // Generate controllers
      const generator = new ControllerGenerator(openApiDoc, outputDir, {
        prettierConfig,
      })
      const result = await generator.generate()

      this.log(`\n✅ Generation complete!`)
      this.log(`   Controllers generated: ${result.controllersGenerated}`)
      this.log(`   Files created: ${result.filesCreated}`)
      this.log(`   Files skipped (already exist): ${result.filesSkipped}`)
      if (result.filesFormatted > 0) {
        this.log(`   Files formatted with prettier: ${result.filesFormatted}`)
      }
      this.log(`   Output directory: ${outputDir}`)

      if (result.errors.length > 0) {
        this.warn('\n⚠️ Warnings:')
        for (const error of result.errors) {
          this.warn(`   - ${error}`)
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        this.error(`Failed to generate controllers: ${error.message}`)
      }
      throw error
    }
  }
}
