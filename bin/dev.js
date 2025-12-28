#!/usr/bin/env ts-node --esm

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
  const commandsDir = path.join(projectRoot, 'src', 'commands');

  // Load top-level commands
  const topLevelCommands = ['ir.ts'];

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
  const genCommands = ['controller.ts'];

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
}

loadCommands().then(() => {
  program.parse();
}).catch((error) => {
  console.error('Failed to load commands:', error);
  process.exit(1);
});
