import { Args, Command, Flags } from '@oclif/core'
import * as path from 'node:path'
import * as fs from 'node:fs'
import { parseOpenAPIFile } from '../lib/openapi-parser'

export default class Ir extends Command {
  static override args = {
    file: Args.string({
      description: 'OpenAPI specification file (YAML or JSON)',
      required: true,
    }),
  }

  static override description =
    'Print the Intermediate Representation (IR) of an OpenAPI specification after loading and resolving all references'

  static override examples = [
    '<%= config.bin %> <%= command.id %> openapi.yaml',
    '<%= config.bin %> <%= command.id %> --output ir.json openapi.yaml',
  ]

  static override flags = {
    output: Flags.string({
      char: 'o',
      description: 'Output file path (default: stdout). If not specified, prints to stdout',
      required: false,
    }),
    format: Flags.string({
      char: 'f',
      description: 'Output format: json or yaml (default: yaml)',
      options: ['json', 'yaml'],
      default: 'yaml',
      required: false,
    }),
  }

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(Ir)

    const inputFile = path.resolve(args.file)

    if (!fs.existsSync(inputFile)) {
      this.error(`File not found: ${inputFile}`)
    }

    try {
      this.log(`Loading OpenAPI file: ${inputFile}`)
      const openApiDoc = await parseOpenAPIFile(inputFile)

      let output: string
      if (flags.format === 'yaml') {
        const yaml = await import('js-yaml')
        output = yaml.dump(openApiDoc, {
          indent: 2,
          lineWidth: -1,
          noRefs: true,
        })
      } else {
        output = JSON.stringify(openApiDoc, null, 2)
      }

      if (flags.output) {
        const outputPath = path.resolve(flags.output)
        fs.writeFileSync(outputPath, output, 'utf-8')
        this.log(`IR written to: ${outputPath}`)
      } else {
        this.log('\n=== OpenAPI IR ===\n')
        console.log(output)
      }
    } catch (error) {
      if (error instanceof Error) {
        this.error(`Failed to load OpenAPI file: ${error.message}`)
      } else {
        this.error(`Failed to load OpenAPI file: ${String(error)}`)
      }
    }
  }
}
