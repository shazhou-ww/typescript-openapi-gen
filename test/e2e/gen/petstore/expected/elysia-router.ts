// Auto-generated Elysia routes from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run


import { Elysia } from 'elysia'
import { events, pets, users } from './controller'

export function createRouter<T extends Elysia>(app: T): T {
  .get('/events/stream', () => events.stream.handleGet({}))
  // @ts-ignore
  .get('/pets', ({ query }) => pets.handleGet({ query }))
  // @ts-ignore
  .post('/pets', ({ body }) => pets.handlePost({ body }))
  // @ts-ignore
  .get('/pets/:petId', ({ params }) => pets._petId.handleGet({ params }))
  // @ts-ignore
  .put('/pets/:petId', ({ params, body }) => pets._petId.handlePut({ params, body }))
  // @ts-ignore
  .delete('/pets/:petId', ({ params }) => pets._petId.handleDelete({ params }))
  // @ts-ignore
  .get('/pets/:petId/photos', ({ params }) => pets._petId.photos.handleGet({ params }))
  // @ts-ignore
  .post('/pets/:petId/photos', ({ params, body }) => pets._petId.photos.handlePost({ params, body }))
  // @ts-ignore
  .get('/users/:userId/profile', ({ params }) => users._userId.profile.handleGet({ params }))

  return app
}

export default createRouter