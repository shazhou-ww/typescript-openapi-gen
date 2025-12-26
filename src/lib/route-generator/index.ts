// Route generator module
// Generates route files from OpenAPI specification for various frameworks

export type { RouteGenerationResult, FlatRoute } from './types.js'
export type { ElysiaRouteGeneratorOptions } from './elysia-generator.js'
export { ElysiaRouteGenerator } from './elysia-generator.js'
export { collectRoutes } from './route-collector.js'
