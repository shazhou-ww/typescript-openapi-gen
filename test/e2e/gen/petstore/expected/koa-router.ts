// Auto-generated Koa routes from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import Router from '@koa/router'

// NOTE: Make sure to install and configure koa-body middleware for request body parsing
// Example: app.use(koaBody({ multipart: true, urlencoded: true, json: true }))

import { events, pets, users } from './controller'

// Type for router with body parsing middleware
type RouterWithBody<StateT = any, ContextT = any> = Router<
  StateT,
  ContextT & { request: { body: unknown } }
>

export function createRouter<StateT = any, ContextT = any>(
  router: Router<StateT, ContextT & { request: { body: unknown } }>,
): Router<StateT, ContextT & { request: { body: unknown } }> {
  router.get('/events/stream', async (ctx, next) => {
    const result = await events.stream.handleGet({})
    ctx.body = result
  })
  router.get('/pets', async (ctx, next) => {
    const query = ctx.query as unknown
    const result = await pets.handleGet({ query })
    ctx.body = result
  })
  router.post('/pets', async (ctx, next) => {
    const body = ctx.request.body as unknown
    const result = await pets.handlePost({ body })
    ctx.body = result
  })
  router.get('/pets/:petId', async (ctx, next) => {
    const params = ctx.params as unknown
    const result = await pets._petId.handleGet({ params })
    ctx.body = result
  })
  router.put('/pets/:petId', async (ctx, next) => {
    const params = ctx.params as unknown
    const body = ctx.request.body as unknown
    const result = await pets._petId.handlePut({ params, body })
    ctx.body = result
  })
  router.delete('/pets/:petId', async (ctx, next) => {
    const params = ctx.params as unknown
    const result = await pets._petId.handleDelete({ params })
    ctx.body = result
  })
  router.get('/pets/:petId/photos', async (ctx, next) => {
    const params = ctx.params as unknown
    const result = await pets._petId.photos.handleGet({ params })
    ctx.body = result
  })
  router.post('/pets/:petId/photos', async (ctx, next) => {
    const params = ctx.params as unknown
    const body = ctx.request.body as unknown
    const result = await pets._petId.photos.handlePost({ params, body })
    ctx.body = result
  })
  router.get('/users/:userId/profile', async (ctx, next) => {
    const params = ctx.params as unknown
    const result = await users._userId.profile.handleGet({ params })
    ctx.body = result
  })

  return router
}

export default createRouter
