// Route generator module
// Generates route files from OpenAPI specification for various frameworks

export type { RouteGenerationResult, FlatRoute } from './types.js'
export type { RouteGeneratorOptions } from './base-generator.js'
export type { ElysiaRouteGeneratorOptions } from './elysia-generator.js'
export type { ExpressRouteGeneratorOptions } from './express-generator.js'
export type { FastifyRouteGeneratorOptions } from './fastify-generator.js'
export type { HonoRouteGeneratorOptions } from './hono-generator.js'
export { ElysiaRouteGenerator } from './elysia-generator.js'
export { ExpressRouteGenerator } from './express-generator.js'
export { FastifyRouteGenerator } from './fastify-generator.js'
export { HonoRouteGenerator } from './hono-generator.js'
export { collectRoutes } from './route-collector.js'
