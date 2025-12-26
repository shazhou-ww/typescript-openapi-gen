// Auto-generated Koa routes from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import Router from '@koa/router'
import { events, pets, users } from './controller'

export const router = new Router()

router.get('/events/stream', async (ctx, next) => {
  const result = await events.stream.handleGet({})
  ctx.body = result
})
router.get('/pets', async (ctx, next) => {
  const query = ctx.query
  const result = await pets.handleGet({ query })
  ctx.body = result
})
router.post('/pets', async (ctx, next) => {
  const body = ctx.request.body
  const result = await pets.handlePost({ body })
  ctx.body = result
})
router.get('/pets/:petId', async (ctx, next) => {
  const params = ctx.params
  const result = await pets._petId.handleGet({ params })
  ctx.body = result
})
router.put('/pets/:petId', async (ctx, next) => {
  const params = ctx.params
  const body = ctx.request.body
  const result = await pets._petId.handlePut({ params, body })
  ctx.body = result
})
router.delete('/pets/:petId', async (ctx, next) => {
  const params = ctx.params
  const result = await pets._petId.handleDelete({ params })
  ctx.body = result
})
router.get('/pets/:petId/photos', async (ctx, next) => {
  const params = ctx.params
  const result = await pets._petId.photos.handleGet({ params })
  ctx.body = result
})
router.post('/pets/:petId/photos', async (ctx, next) => {
  const params = ctx.params
  const body = ctx.request.body
  const result = await pets._petId.photos.handlePost({ params, body })
  ctx.body = result
})
router.get('/users/:userId/profile', async (ctx, next) => {
  const params = ctx.params
  const result = await users._userId.profile.handleGet({ params })
  ctx.body = result
})

export default router
