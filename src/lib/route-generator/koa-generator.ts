import type { OpenAPIDocument } from '../openapi-parser.js'
import type { FlatRoute } from './types.js'
import { BaseRouteGenerator, type RouteGeneratorOptions } from './base-generator.js'

export interface KoaRouteGeneratorOptions extends RouteGeneratorOptions {}

export class KoaRouteGenerator extends BaseRouteGenerator {
  protected getFrameworkName(): string {
    return 'Koa'
  }

  protected generateImports(routes: FlatRoute[]): string[] {
    const lines: string[] = []

    // Import Koa Router
    lines.push("import Router from '@koa/router'")

    // Import controllers
    const topLevelModules = this.getTopLevelModules(routes)
    const relativeControllerPath = this.getRelativeControllerPath()

    if (topLevelModules.length > 0) {
      lines.push(
        `import { ${topLevelModules.join(', ')} } from '${relativeControllerPath}'`,
      )
    }

    lines.push('')
    lines.push('export const router = new Router()')

    return lines
  }

  protected generateRouteDefinitions(routes: FlatRoute[]): string[] {
    const lines: string[] = []

    for (const route of routes) {
      lines.push(this.generateRoute(route))
      this.result.routesGenerated++
    }

    lines.push('')
    lines.push('export default router')

    return lines
  }

  protected generateRoute(route: FlatRoute): string {
    const controllerPath = route.controllerImportPath.join('.')
    const handlerCall = `${controllerPath}.${route.handlerName}`

    const koaPath = this.convertPath(route.path)
    const inputObject = this.buildInputObject(route)

    // Koa handlers: async (ctx, next) => {}
    // Extract from ctx.params, ctx.query, ctx.request.body, ctx.headers
    const inputParts = this.buildInputParts(route)
    const ctxExtractions: string[] = []

    if (inputParts.includes('params')) {
      ctxExtractions.push('const params = ctx.params')
    }
    if (inputParts.includes('query')) {
      ctxExtractions.push('const query = ctx.query')
    }
    if (inputParts.includes('headers')) {
      ctxExtractions.push('const headers = ctx.headers')
    }
    if (inputParts.includes('body')) {
      ctxExtractions.push('const body = ctx.request.body')
    }

    const handlerBody = ctxExtractions.length > 0
      ? `async (ctx, next) => {\n    ${ctxExtractions.join('\n    ')}\n    const result = await ${handlerCall}(${inputObject})\n    ctx.body = result\n  }`
      : `async (ctx, next) => {\n    const result = await ${handlerCall}(${inputObject})\n    ctx.body = result\n  }`

    return `router.${route.method}('${koaPath}', ${handlerBody})`
  }

  protected convertPath(routePath: string): string {
    // Koa uses :paramName format
    return routePath.replace(/\{([^}]+)\}/g, ':$1')
  }
}

