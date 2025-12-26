import { isSSEOperation } from '../openapi-parser.js'
import type { OpenAPIDocument } from '../openapi-parser.js'
import type { FlatRoute } from './types.js'
import { BaseRouteGenerator, type RouteGeneratorOptions } from './base-generator.js'

export interface ExpressRouteGeneratorOptions extends RouteGeneratorOptions {}

export class ExpressRouteGenerator extends BaseRouteGenerator {
  protected getFrameworkName(): string {
    return 'Express'
  }

  protected generateImports(routes: FlatRoute[]): string[] {
    const lines: string[] = []

    // Import Express Router
    lines.push("import { Router } from 'express'")

    // Import controllers
    const topLevelModules = this.getTopLevelModules(routes)
    const relativeControllerPath = this.getRelativeControllerPath()

    if (topLevelModules.length > 0) {
      lines.push(
        `import { ${topLevelModules.join(', ')} } from '${relativeControllerPath}'`,
      )
    }

    lines.push('')
    lines.push('export const router = Router()')

    return lines
  }

  protected generateRouteDefinitions(routes: FlatRoute[]): string[] {
    const lines: string[] = []

    // Generate router decorator function
    lines.push('export function createRouter(router: Router): Router {')

    for (const route of routes) {
      lines.push(this.generateRoute(route))
      this.result.routesGenerated++
    }

    lines.push('')
    lines.push('  return router')
    lines.push('}')
    lines.push('')
    lines.push('export default createRouter')

    return lines
  }

  protected generateRoute(route: FlatRoute): string {
    const controllerPath = route.controllerImportPath.join('.')
    const handlerCall = `${controllerPath}.${route.handlerName}`

    const expressPath = this.convertPath(route.path)
    const inputObject = this.buildInputObject(route)
    const isSSE = isSSEOperation(route.operation)

    // Express handlers: (req, res, next) => {}
    // We need to extract params, query, headers, body from req
    const inputParts = this.buildInputParts(route)
    const reqExtractions: string[] = []

    if (inputParts.includes('params')) {
      reqExtractions.push('const params = req.params as unknown')
    }
    if (inputParts.includes('query')) {
      reqExtractions.push('const query = req.query as unknown')
    }
    if (inputParts.includes('headers')) {
      reqExtractions.push('const headers = req.headers as unknown')
    }
    if (inputParts.includes('body')) {
      reqExtractions.push('const body = req.body as unknown')
    }

    let handlerBody: string

    if (isSSE) {
      // SSE handler: set headers and stream events
      const setupCode = reqExtractions.length > 0
        ? `${reqExtractions.join('\n    ')}\n    `
        : ''

      handlerBody = `async (req, res, next) => {
    ${setupCode}res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')
    res.flushHeaders()

    try {
      for await (const event of ${handlerCall}(${inputObject})) {
        res.write(\`data: \${JSON.stringify(event)}\\n\\n\`)
      }
    } catch (error) {
      res.write(\`event: error\\ndata: \${JSON.stringify({ error: error.message })}\\n\\n\`)
    } finally {
      res.end()
    }
  }`
    } else {
      // Regular JSON handler
      handlerBody = reqExtractions.length > 0
        ? `async (req, res, next) => {\n    ${reqExtractions.join('\n    ')}\n    const result = await ${handlerCall}(${inputObject})\n    res.json(result)\n  }`
        : `async (req, res, next) => {\n    const result = await ${handlerCall}(${inputObject})\n    res.json(result)\n  }`
    }

    return `router.${route.method}('${expressPath}', ${handlerBody})`
  }

  protected convertPath(routePath: string): string {
    // Express uses :paramName format
    return routePath.replace(/\{([^}]+)\}/g, ':$1')
  }
}

