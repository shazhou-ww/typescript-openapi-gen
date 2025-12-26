// Auto-generated Elysia routes from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import { Elysia } from 'elysia'
import { events, pets, users } from './controller'

export const routes = new Elysia()
  .get('/events/stream', () => events.stream.handleGet({}))
  .get('/pets', ({ query }) => pets.handleGet({ query }))
  .post('/pets', ({ body }) => pets.handlePost({ body }))
  .get('/pets/:petId', ({ params }) => pets._petId.handleGet({ params }))
  .put('/pets/:petId', ({ params, body }) =>
    pets._petId.handlePut({ params, body }),
  )
  .delete('/pets/:petId', ({ params }) => pets._petId.handleDelete({ params }))
  .get('/pets/:petId/photos', ({ params }) =>
    pets._petId.photos.handleGet({ params }),
  )
  .post('/pets/:petId/photos', ({ params, body }) =>
    pets._petId.photos.handlePost({ params, body }),
  )
  .get('/users/:userId/profile', ({ params }) =>
    users._userId.profile.handleGet({ params }),
  )
