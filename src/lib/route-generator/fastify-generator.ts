import { isSSEOperation } from '../openapi-parser.js'
import type { OpenAPIDocument } from '../openapi-parser.js'
import type { FlatRoute } from './types.js'
import { BaseRouteGenerator, type RouteGeneratorOptions } from './base-generator.js'

export interface FastifyRouteGeneratorOptions extends RouteGeneratorOptions {}

export class FastifyRouteGenerator extends BaseRouteGenerator {
  protected getFrameworkName(): string {
    return 'Fastify'
  }

  protected generateImports(routes: FlatRoute[]): string[] {
    const lines: string[] = []

    // Import Fastify with TypeBox
    lines.push("import type { FastifyInstance } from 'fastify'")
    lines.push("import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'")

    // Import controllers
    const topLevelModules = this.getTopLevelModules(routes)
    const relativeControllerPath = this.getRelativeControllerPath()

    if (topLevelModules.length > 0) {
      lines.push(
        `import { ${topLevelModules.join(', ')} } from '${relativeControllerPath}'`,
      )
    }

    return lines
  }

  protected generateRouteDefinitions(routes: FlatRoute[]): string[] {
    const lines: string[] = []

    // Generate router decorator function
    lines.push('export async function createRouter(fastify: FastifyInstance): Promise<void> {')
    lines.push('  fastify.withTypeProvider<TypeBoxTypeProvider>()')

    for (const route of routes) {
      lines.push(this.generateRoute(route))
      this.result.routesGenerated++
    }

    lines.push('}')
    lines.push('')
    lines.push('export default createRouter')

    return lines
  }

  protected generateRoute(route: FlatRoute): string {
    const controllerPath = route.controllerImportPath.join('.')
    const handlerCall = `${controllerPath}.${route.handlerName}`

    const fastifyPath = this.convertPath(route.path)
    const inputObject = this.buildInputObject(route)
    const isSSE = isSSEOperation(route.operation)

    // Fastify handlers: async (request, reply) => {}
    // Extract from request.params, request.query, request.body, request.headers
    const inputParts = this.buildInputParts(route)
    const requestExtractions: string[] = []

    if (inputParts.includes('params')) {
      requestExtractions.push('const params = request.params as unknown')
    }
    if (inputParts.includes('query')) {
      requestExtractions.push('const query = request.query as unknown')
    }
    if (inputParts.includes('headers')) {
      requestExtractions.push('const headers = request.headers as unknown')
    }
    if (inputParts.includes('body')) {
      requestExtractions.push('const body = request.body as unknown')
    }

    let handlerBody: string

    if (isSSE) {
      // SSE handler: set headers and return async generator
      const setupCode = requestExtractions.length > 0
        ? `${requestExtractions.join('\n    ')}\n    `
        : ''

      handlerBody = `async function* (request, reply) {
    ${setupCode}reply.header('Content-Type', 'text/event-stream')
    reply.header('Cache-Control', 'no-cache')
    reply.header('Connection', 'keep-alive')

    try {
      yield* ${handlerCall}(${inputObject})
    } catch (error) {
      yield { event: 'error', data: { error: error.message } }
    }
  }`
    } else {
      // Regular handler
      handlerBody = requestExtractions.length > 0
        ? `async (request, reply) => {\n    ${requestExtractions.join('\n    ')}\n    const result = await ${handlerCall}(${inputObject})\n    return result\n  }`
        : `async (request, reply) => {\n    const result = await ${handlerCall}(${inputObject})\n    return result\n  }`
    }

    return `  fastify.${route.method}('${fastifyPath}', ${handlerBody})`
  }

  protected convertPath(routePath: string): string {
    // Fastify uses :paramName format
    return routePath.replace(/\{([^}]+)\}/g, ':$1')
  }
}

