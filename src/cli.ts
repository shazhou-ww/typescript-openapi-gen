#!/usr/bin/env node

import { Command } from 'commander'

const registerIrCommand = require('./commands/ir')
const registerControllerCommand = require('./commands/gen/controller')
const registerOpenapiCommand = require('./commands/gen/openapi')
const registerElysiaCommand = require('./commands/gen/elysia')
const registerExpressCommand = require('./commands/gen/express')
const registerFastifyCommand = require('./commands/gen/fastify')
const registerHonoCommand = require('./commands/gen/hono')
const registerRouterElysiaCommand = require('./commands/gen/router/elysia')
const registerRouterExpressCommand = require('./commands/gen/router/express')
const registerRouterFastifyCommand = require('./commands/gen/router/fastify')
const registerRouterHonoCommand = require('./commands/gen/router/hono')

const program = new Command()

program
  .name('tsoapi')
  .description('Generate TypeScript controllers and routes from OpenAPI specifications')
  .version('0.2.3')

// Register top-level commands
registerIrCommand(program)

// Register gen command group
const genCmd = program.command('gen').description('Generate code from OpenAPI specs')

registerControllerCommand(genCmd)
registerOpenapiCommand(genCmd)
registerElysiaCommand(genCmd)
registerExpressCommand(genCmd)
registerFastifyCommand(genCmd)
registerHonoCommand(genCmd)

// Register gen router command group
const routerCmd = genCmd.command('router').description('Generate router for a specific framework')

registerRouterElysiaCommand(routerCmd)
registerRouterExpressCommand(routerCmd)
registerRouterFastifyCommand(routerCmd)
registerRouterHonoCommand(routerCmd)

program.parse()

