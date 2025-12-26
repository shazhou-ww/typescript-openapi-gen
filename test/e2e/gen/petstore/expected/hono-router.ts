// Auto-generated Hono routes from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import { Hono } from 'hono'
import { streamSSE } from 'hono/streaming'
import { events, pets, users } from './controller'

export const app = new Hono()

export function createRouter<T extends Hono>(app: T): T {
  app.get('/events/stream', (c) =>
    streamSSE(c, async (stream) => {
      try {
        for await (const event of events.stream.handleGet({})) {
          await stream.writeSSE({
            data: JSON.stringify(event),
            event: 'message',
            id: String(Date.now()),
          })
        }
      } catch (error) {
        await stream.writeSSE({
          data: JSON.stringify({ error: error.message }),
          event: 'error',
          id: String(Date.now()),
        })
      }
    }),
  )
  app.get('/pets', async (c) => {
    const query = c.req.query() as unknown
    const result = await pets.handleGet({ query })
    return c.json(result)
  })
  app.post('/pets', async (c) => {
    const body = (await c.req.json()) as unknown
    await pets.handlePost({ body })
    return new Response(null, { status: 204 })
  })
  app.get('/pets/:petId', async (c) => {
    const params = c.req.param() as unknown
    const result = await pets._petId.handleGet({ params })
    return c.json(result)
  })
  app.put('/pets/:petId', async (c) => {
    const params = c.req.param() as unknown
    const body = (await c.req.json()) as unknown
    const result = await pets._petId.handlePut({ params, body })
    return c.json(result)
  })
  app.delete('/pets/:petId', async (c) => {
    const params = c.req.param() as unknown
    await pets._petId.handleDelete({ params })
    return new Response(null, { status: 204 })
  })
  app.get('/pets/:petId/photos', async (c) => {
    const params = c.req.param() as unknown
    const result = await pets._petId.photos.handleGet({ params })
    return c.json(result)
  })
  app.post('/pets/:petId/photos', async (c) => {
    const params = c.req.param() as unknown
    const body = (await c.req.json()) as unknown
    await pets._petId.photos.handlePost({ params, body })
    return new Response(null, { status: 204 })
  })
  app.get('/users/:userId/profile', async (c) => {
    const params = c.req.param() as unknown
    const result = await users._userId.profile.handleGet({ params })
    return c.json(result)
  })

  return app
}

export default createRouter
