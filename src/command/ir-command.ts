/**
 * registerIrCommand(program: Command, deps: ProgramDeps): void
 * - program: Commander 程序实例
 * - deps: 依赖
 */

import { Command } from 'commander';
import * as fs from 'node:fs';
import * as path from 'node:path';
import type { ProgramDeps } from './deps';

export function registerIrCommand(program: Command, deps: ProgramDeps): void {
  program
    .command('ir')
    .description('Display OpenAPI specification as intermediate representation')
    .argument('<file>', 'OpenAPI specification file (YAML or JSON)')
    .option('--validate', 'Validate the OpenAPI specification', false)
    .action(async (file: string, options: { validate?: boolean }) => {
      const inputFile = path.resolve(file);

      if (!fs.existsSync(inputFile)) {
        console.error(`Input file not found: ${inputFile}`);
        process.exit(1);
      }

      try {
        const doc = await deps.load(inputFile);

        if (options.validate) {
          const result = await deps.runAnalysis(doc, { type: 'analysis', analyzers: ['structure', 'refs'] });
          printDiagnostics(result.diagnostics);
          if (!result.success) process.exit(1);
        }

        console.log(JSON.stringify(doc, null, 2));
      } catch (error) {
        console.error(`Failed: ${error instanceof Error ? error.message : String(error)}`);
        process.exit(1);
      }
    });
}

function printDiagnostics(diagnostics: Array<{ type: string; message: string }>): void {
  for (const d of diagnostics) {
    const prefix = d.type === 'error' ? '❌' : d.type === 'warning' ? '⚠️' : 'ℹ️';
    console.log(`${prefix} ${d.message}`);
  }
}

