import { Command } from 'commander'
import * as path from 'node:path'
import * as fs from 'node:fs'
import { parseOpenAPIFile } from '../lib/openapi-parser'

function registerIrCommand(program: Command) {
  program
    .command('ir')
    .description('Print the Intermediate Representation (IR) of an OpenAPI specification after loading and resolving all references')
    .argument('<file>', 'OpenAPI specification file (YAML or JSON)')
    .option('-o, --output <path>', 'Output file path (default: stdout). If not specified, prints to stdout')
    .option('-f, --format <format>', 'Output format: json or yaml (default: yaml)', 'yaml')
    .action(async (file: string, options: { output?: string; format: string }) => {
      const inputFile = path.resolve(file)

      if (!fs.existsSync(inputFile)) {
        console.error(`File not found: ${inputFile}`)
        process.exit(1)
      }

      try {
        console.log(`Loading OpenAPI file: ${inputFile}`)
        const openApiDoc = await parseOpenAPIFile(inputFile)

        let output: string
        if (options.format === 'yaml') {
          const yaml = await import('js-yaml')
          output = yaml.dump(openApiDoc, {
            indent: 2,
            lineWidth: -1,
            noRefs: true,
          })
        } else {
          output = JSON.stringify(openApiDoc, null, 2)
        }

        if (options.output) {
          const outputPath = path.resolve(options.output)
          fs.writeFileSync(outputPath, output, 'utf-8')
          console.log(`IR written to: ${outputPath}`)
        } else {
          console.log('\n=== OpenAPI IR ===\n')
          console.log(output)
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error(`Failed to load OpenAPI file: ${error.message}`)
        } else {
          console.error(`Failed to load OpenAPI file: ${String(error)}`)
        }
        process.exit(1)
      }
    })
}

module.exports = registerIrCommand
