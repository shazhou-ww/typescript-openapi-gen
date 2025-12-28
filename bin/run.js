#!/usr/bin/env node

import { Command } from 'commander';
import * as path from 'path';
import * as fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const program = new Command();

program
  .name('tsoapi')
  .description('Generate TypeScript controllers and routes from OpenAPI specifications')
  .version('0.2.3');

// Import and register commands dynamically
async function loadCommands() {
  const commandsDir = path.join(projectRoot, 'dist', 'commands');

  // Load top-level commands
  const topLevelCommands = ['ir.js'];

  for (const cmdFile of topLevelCommands) {
    const cmdPath = path.join(commandsDir, cmdFile);
    if (fs.existsSync(cmdPath)) {
      try {
        const fileUrl = `file://${cmdPath.replace(/\\/g, '/')}`;
        const cmdModule = await import(fileUrl);
        if (typeof cmdModule === 'function') {
          cmdModule(program);
        }
      } catch (error) {
        console.error(`Failed to load command ${cmdFile}:`, error);
      }
    }
  }

  // Load gen commands
  const genDir = path.join(commandsDir, 'gen');
  const genCommands = ['controller.js'];

  const genCmd = program.command('gen').description('Generate code from OpenAPI specs');

  for (const cmdFile of genCommands) {
    const cmdPath = path.join(genDir, cmdFile);
    if (fs.existsSync(cmdPath)) {
      try {
        const fileUrl = `file://${cmdPath.replace(/\\/g, '/')}`;
        const cmdModule = await import(fileUrl);
        if (typeof cmdModule === 'function') {
          cmdModule(genCmd);
        }
      } catch (error) {
        console.error(`Failed to load gen command ${cmdFile}:`, error);
      }
    }
  }

  // Also register controller directly on gen for now
  genCmd.command('controller')
    .description('Generate controller skeleton code from OpenAPI specification')
    .argument('<file>', 'OpenAPI specification file (YAML or JSON)')
    .requiredOption('-o, --output-dir <path>', 'Output directory for generated files')
    .option('--controller-folder <name>', 'Subfolder name for controllers (default: controller)')
    .option('--shared-types-folder <name>', 'Subfolder name for shared types (default: shared-types)')
    .option('--prettier <path>', 'Path to prettier config file for formatting output')
    .action(async (file, options) => {
      const { parseOpenAPIFile } = await import('./dist/lib/openapi-parser/index.js');
      const { ControllerGenerator } = await import('./dist/lib/controller-generator/index.js');
      const fs = await import('fs');
      const path = await import('path');

      const inputFile = path.resolve(file);
      const outputDir = path.resolve(options.outputDir);
      const prettierConfig = options.prettier
        ? path.resolve(options.prettier)
        : undefined;

      // Check if input file exists
      if (!fs.existsSync(inputFile)) {
        console.error(`Input file not found: ${inputFile}`);
        process.exit(1);
      }

      // Check if prettier config exists (if provided)
      if (prettierConfig && !fs.existsSync(prettierConfig)) {
        console.error(`Prettier config file not found: ${prettierConfig}`);
        process.exit(1);
      }

      console.log(`Parsing OpenAPI file: ${inputFile}`);

      try {
        // Parse OpenAPI file
        const openApiDoc = await parseOpenAPIFile(inputFile);

        // Generate controllers
        const generator = new ControllerGenerator(openApiDoc, outputDir, {
          prettierConfig,
          controllerFolder: options.controllerFolder,
          sharedTypesFolder: options.sharedTypesFolder,
        });
        const result = await generator.generate();

        console.log(`\n✅ Generation complete!`);
        console.log(`   Controllers generated: ${result.controllersGenerated}`);
        console.log(`   Files created: ${result.filesCreated}`);
        console.log(`   Files skipped (already exist): ${result.filesSkipped}`);
        if (result.filesFormatted > 0) {
          console.log(`   Files formatted with prettier: ${result.filesFormatted}`);
        }
        console.log(`   Output directory: ${outputDir}`);

        if (result.errors.length > 0) {
          console.warn('\n⚠️ Warnings:');
          for (const error of result.errors) {
            console.warn(`   - ${error}`);
          }
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error(`Failed to generate controllers: ${error.message}`);
        } else {
          console.error(`Failed to generate controllers: ${String(error)}`);
        }
        process.exit(1);
      }
    });
}

loadCommands().then(() => {
  program.parse();
}).catch((error) => {
  console.error('Failed to load commands:', error);
  process.exit(1);
});
