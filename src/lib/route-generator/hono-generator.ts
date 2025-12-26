import type { OpenAPIDocument } from '../openapi-parser.js'
import type { FlatRoute } from './types.js'
import { BaseRouteGenerator, type RouteGeneratorOptions } from './base-generator.js'

export interface HonoRouteGeneratorOptions extends RouteGeneratorOptions {}

export class HonoRouteGenerator extends BaseRouteGenerator {
  protected getFrameworkName(): string {
    return 'Hono'
  }

  protected generateImports(routes: FlatRoute[]): string[] {
    const lines: string[] = []

    // Import Hono
    lines.push("import { Hono } from 'hono'")

    // Import controllers
    const topLevelModules = this.getTopLevelModules(routes)
    const relativeControllerPath = this.getRelativeControllerPath()

    if (topLevelModules.length > 0) {
      lines.push(
        `import { ${topLevelModules.join(', ')} } from '${relativeControllerPath}'`,
      )
    }

    lines.push('')
    lines.push('export const app = new Hono()')

    return lines
  }

  protected generateRouteDefinitions(routes: FlatRoute[]): string[] {
    const lines: string[] = []

    // Generate router decorator function
    lines.push('export function createRouter<T extends Hono>(app: T): T {')

    for (const route of routes) {
      lines.push(this.generateRoute(route))
      this.result.routesGenerated++
    }

    lines.push('')
    lines.push('  return app')
    lines.push('}')
    lines.push('')
    lines.push('export default createRouter')

    return lines
  }

  protected generateRoute(route: FlatRoute): string {
    const controllerPath = route.controllerImportPath.join('.')
    const handlerCall = `${controllerPath}.${route.handlerName}`

    const honoPath = this.convertPath(route.path)
    const inputParts = this.buildInputParts(route)
    const destructure =
      inputParts.length > 0 ? `{ ${inputParts.join(', ')} }` : ''
    const inputObject = this.buildInputObject(route)

    // Hono handlers: (c) => {}
    // Extract from c.req.param(), c.req.query(), c.req.header(), c.req.json()
    const handlerBody = this.buildHonoHandlerBody(route, inputParts, handlerCall, inputObject)

    return `app.${route.method}('${honoPath}', ${handlerBody})`
  }

  private buildHonoHandlerBody(
    route: FlatRoute,
    inputParts: string[],
    handlerCall: string,
    inputObject: string,
  ): string {
    if (inputParts.length === 0) {
      if (route.returnType === 'void') {
        return `async (c) => {\n    await ${handlerCall}(${inputObject})\n    return new Response(null, { status: 204 })\n  }`
      }
      return `async (c) => {\n    const result = await ${handlerCall}(${inputObject})\n    return c.json(result)\n  }`
    }

    const extractions: string[] = []
    if (inputParts.includes('params')) {
      extractions.push('const params = c.req.param() as unknown')
    }
    if (inputParts.includes('query')) {
      extractions.push('const query = c.req.query() as unknown')
    }
    if (inputParts.includes('headers')) {
      extractions.push('const headers = Object.fromEntries(c.req.header()) as unknown')
    }
    if (inputParts.includes('body')) {
      extractions.push('const body = await c.req.json() as unknown')
    }

    if (route.returnType === 'void') {
      return `async (c) => {\n    ${extractions.join('\n    ')}\n    await ${handlerCall}(${inputObject})\n    return new Response(null, { status: 204 })\n  }`
    }

    return `async (c) => {\n    ${extractions.join('\n    ')}\n    const result = await ${handlerCall}(${inputObject})\n    return c.json(result)\n  }`
  }

  protected convertPath(routePath: string): string {
    // Hono uses :paramName format
    return routePath.replace(/\{([^}]+)\}/g, ':$1')
  }
}

