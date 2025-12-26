// Auto-generated Elysia routes from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import { Elysia } from 'elysia'
import { events, pets, users } from './controller'

export const routes = new Elysia()
  .get('/events/stream', () => events.stream.handleGet({}))
  /* @ts-ignore - Elysia handles type validation at runtime */
  .get('/pets', ({ query }) => pets.handleGet({ query }))
  /* @ts-ignore - Elysia handles type validation at runtime */
  .post('/pets', ({ body }) => pets.handlePost({ body }))
  /* @ts-ignore - Elysia handles type validation at runtime */
  .get('/pets/:petId', ({ params }) => pets._petId.handleGet({ params }))
  /* @ts-ignore - Elysia handles type validation at runtime */
  .put('/pets/:petId', ({ params, body }) =>
    pets._petId.handlePut({ params, body }),
  )
  /* @ts-ignore - Elysia handles type validation at runtime */
  .delete('/pets/:petId', ({ params }) => pets._petId.handleDelete({ params }))
  /* @ts-ignore - Elysia handles type validation at runtime */
  .get('/pets/:petId/photos', ({ params }) =>
    pets._petId.photos.handleGet({ params }),
  )
  /* @ts-ignore - Elysia handles type validation at runtime */
  .post('/pets/:petId/photos', ({ params, body }) =>
    pets._petId.photos.handlePost({ params, body }),
  )
  /* @ts-ignore - Elysia handles type validation at runtime */
  .get('/users/:userId/profile', ({ params }) =>
    users._userId.profile.handleGet({ params }),
  )
