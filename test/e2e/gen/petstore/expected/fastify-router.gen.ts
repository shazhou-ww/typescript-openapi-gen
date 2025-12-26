// Auto-generated Fastify routes from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import type { FastifyInstance } from 'fastify'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import ssePlugin from '@fastify/sse'
import { events, pets, users } from './controller'

/**
 * Decorates a Fastify instance with generated routes.
 * Usage: await decorateRouter(fastify)
 */
export async function decorateRouter(fastify: FastifyInstance): Promise<void> {
  fastify.register(ssePlugin)
  fastify.withTypeProvider<TypeBoxTypeProvider>()
  fastify.get('/events/stream', { sse: true }, async (request, reply) => {
    await reply.sse.send(
      (async function* () {
        try {
          for await (const event of events.stream.handleGet({})) {
            yield {
              id: String(Date.now()),
              event: 'message',
              data: JSON.stringify(event),
            }
          }
        } catch (error) {
          yield {
            id: String(Date.now()),
            event: 'error',
            data: JSON.stringify({ error: error.message }),
          }
        }
      })(),
    )
  })
  fastify.get('/pets', async (request, reply) => {
    const query = request.query
    const result = await pets.handleGet({ query })
    return result
  })
  fastify.post('/pets', async (request, reply) => {
    const body = request.body
    const result = await pets.handlePost({ body })
    return result
  })
  fastify.get('/pets/:petId', async (request, reply) => {
    const params = request.params
    const result = await pets._petId.handleGet({ params })
    return result
  })
  fastify.put('/pets/:petId', async (request, reply) => {
    const params = request.params
    const body = request.body
    const result = await pets._petId.handlePut({ params, body })
    return result
  })
  fastify.delete('/pets/:petId', async (request, reply) => {
    const params = request.params
    const result = await pets._petId.handleDelete({ params })
    return result
  })
  fastify.get('/pets/:petId/photos', async (request, reply) => {
    const params = request.params
    const result = await pets._petId.photos.handleGet({ params })
    return result
  })
  fastify.post('/pets/:petId/photos', async (request, reply) => {
    const params = request.params
    const body = request.body
    const result = await pets._petId.photos.handlePost({ params, body })
    return result
  })
  fastify.get('/users/:userId/profile', async (request, reply) => {
    const params = request.params
    const result = await users._userId.profile.handleGet({ params })
    return result
  })
}

export default decorateRouter
