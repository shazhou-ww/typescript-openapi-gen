// Auto-generated Hono routes from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import { Hono } from 'hono'
import { events, pets, users } from './controller'

export const app = new Hono()

app.get('/events/stream', async (c) => {
  const result = await events.stream.handleGet({})
  return c.json(result)
})
app.get('/pets', async (c) => {
  const query = Object.fromEntries(c.req.query())
  const result = await pets.handleGet({ query })
  return c.json(result)
})
app.post('/pets', async (c) => {
  const body = await c.req.json()
  const result = await pets.handlePost({ body })
  return c.json(result)
})
app.get('/pets/:petId', async (c) => {
  const params = c.req.param()
  const result = await pets._petId.handleGet({ params })
  return c.json(result)
})
app.put('/pets/:petId', async (c) => {
  const params = c.req.param()
  const body = await c.req.json()
  const result = await pets._petId.handlePut({ params, body })
  return c.json(result)
})
app.delete('/pets/:petId', async (c) => {
  const params = c.req.param()
  const result = await pets._petId.handleDelete({ params })
  return c.json(result)
})
app.get('/pets/:petId/photos', async (c) => {
  const params = c.req.param()
  const result = await pets._petId.photos.handleGet({ params })
  return c.json(result)
})
app.post('/pets/:petId/photos', async (c) => {
  const params = c.req.param()
  const body = await c.req.json()
  const result = await pets._petId.photos.handlePost({ params, body })
  return c.json(result)
})
app.get('/users/:userId/profile', async (c) => {
  const params = c.req.param()
  const result = await users._userId.profile.handleGet({ params })
  return c.json(result)
})

export default app
