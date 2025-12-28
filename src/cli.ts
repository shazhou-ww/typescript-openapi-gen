#!/usr/bin/env bun

import { Command } from 'commander'

import registerIrCommand from './commands/ir'
import registerControllerCommand from './commands/gen/controller'
import registerOpenapiCommand from './commands/gen/openapi'
import registerElysiaCommand from './commands/gen/elysia'
import registerExpressCommand from './commands/gen/express'
import registerFastifyCommand from './commands/gen/fastify'
import registerHonoCommand from './commands/gen/hono'
import registerRouterElysiaCommand from './commands/gen/router/elysia'
import registerRouterExpressCommand from './commands/gen/router/express'
import registerRouterFastifyCommand from './commands/gen/router/fastify'
import registerRouterHonoCommand from './commands/gen/router/hono'

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

