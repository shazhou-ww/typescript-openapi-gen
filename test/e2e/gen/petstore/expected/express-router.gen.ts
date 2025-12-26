// Auto-generated Express routes from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import { Router } from 'express'
import { events, pets, users } from './controller'

export const router = Router()

export function createRouter(router: Router): Router {
  router.get('/events/stream', async (req, res, next) => {
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')
    res.flushHeaders()

    try {
      for await (const event of events.stream.handleGet({})) {
        res.write(`data: ${JSON.stringify(event)}\n\n`)
      }
    } catch (error) {
      res.write(
        `event: error\ndata: ${JSON.stringify({ error: error.message })}\n\n`,
      )
    } finally {
      res.end()
    }
  })
  router.get('/pets', async (req, res, next) => {
    const query = req.query
    const result = await pets.handleGet({ query })
    res.json(result)
  })
  router.post('/pets', async (req, res, next) => {
    const body = req.body
    const result = await pets.handlePost({ body })
    res.json(result)
  })
  router.get('/pets/:petId', async (req, res, next) => {
    const params = req.params
    const result = await pets._petId.handleGet({ params })
    res.json(result)
  })
  router.put('/pets/:petId', async (req, res, next) => {
    const params = req.params
    const body = req.body
    const result = await pets._petId.handlePut({ params, body })
    res.json(result)
  })
  router.delete('/pets/:petId', async (req, res, next) => {
    const params = req.params
    const result = await pets._petId.handleDelete({ params })
    res.json(result)
  })
  router.get('/pets/:petId/photos', async (req, res, next) => {
    const params = req.params
    const result = await pets._petId.photos.handleGet({ params })
    res.json(result)
  })
  router.post('/pets/:petId/photos', async (req, res, next) => {
    const params = req.params
    const body = req.body
    const result = await pets._petId.photos.handlePost({ params, body })
    res.json(result)
  })
  router.get('/users/:userId/profile', async (req, res, next) => {
    const params = req.params
    const result = await users._userId.profile.handleGet({ params })
    res.json(result)
  })

  return router
}

export default createRouter
