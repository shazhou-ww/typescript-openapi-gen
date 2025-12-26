// Auto-generated Express routes from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import { Router } from 'express'
import { events, pets, users } from './controller'

export const router = Router()

router.get('/events/stream', async (req, res, next) => {
  const result = await events.stream.handleGet({})
  res.json(result)
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

export default router
