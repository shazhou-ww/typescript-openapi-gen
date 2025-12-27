import { Args, Command } from '@oclif/core'
import * as path from 'node:path'
import * as fs from 'node:fs'
// @ts-ignore - @apidevtools/swagger-parser may not have type definitions
import SwaggerParser from '@apidevtools/swagger-parser'

export default class Validate extends Command {
  static override args = {
    file: Args.string({
      description: 'OpenAPI specification file (YAML or JSON)',
      required: true,
    }),
  }

  static override description =
    'Validate an OpenAPI specification file using @apidevtools/swagger-parser'

  static override examples = [
    '<%= config.bin %> <%= command.id %> openapi.yaml',
  ]

  public async run(): Promise<void> {
    const { args } = await this.parse(Validate)

    const inputFile = path.resolve(args.file)

    if (!fs.existsSync(inputFile)) {
      this.error(`File not found: ${inputFile}`)
    }

    try {
      this.log(`Validating OpenAPI file: ${inputFile}`)
      
      // Validate and resolve all references
      const api = await SwaggerParser.validate(inputFile, {
        validate: {
          spec: true,
          schema: true,
        },
        dereference: {
          circular: 'ignore',
        },
      })

      this.log('\n✅ Validation passed!')
      const apiDoc = api as any
      this.log(`   OpenAPI version: ${apiDoc.openapi || apiDoc.swagger || 'N/A'}`)
      this.log(`   Title: ${apiDoc.info?.title || 'N/A'}`)
      this.log(`   Version: ${apiDoc.info?.version || 'N/A'}`)
      this.log(`   Paths: ${Object.keys(apiDoc.paths || {}).length}`)
      this.log(`   Components schemas: ${Object.keys(apiDoc.components?.schemas || {}).length}`)
      
      this.log('\n✅ Validation completed')
    } catch (error: any) {
      if (error.details) {
        this.error(`\n❌ Validation failed:\n${JSON.stringify(error.details, null, 2)}`)
      } else if (error.message) {
        this.error(`\n❌ Validation failed: ${error.message}`)
      } else {
        this.error(`\n❌ Validation failed: ${String(error)}`)
      }
    }
  }
}
