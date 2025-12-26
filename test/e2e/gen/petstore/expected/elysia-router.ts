// Auto-generated Elysia routes from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import { Elysia } from 'elysia'
import { events, pets, users } from './controller'

export function createRouter<T extends Elysia>(app: T): T {
  app.get('/events/stream', () => events.stream.handleGet({}))
  app.get('/pets', ({ query }) => pets.handleGet({ query }))
  app.post('/pets', ({ body }) => pets.handlePost({ body }))
  app.get('/pets/:petId', ({ params }) => pets._petId.handleGet({ params }))
  app.put('/pets/:petId', ({ params, body }) =>
    pets._petId.handlePut({ params, body }),
  )
  app.delete('/pets/:petId', ({ params }) =>
    pets._petId.handleDelete({ params }),
  )
  app.get('/pets/:petId/photos', ({ params }) =>
    pets._petId.photos.handleGet({ params }),
  )
  app.post('/pets/:petId/photos', ({ params, body }) =>
    pets._petId.photos.handlePost({ params, body }),
  )
  app.get('/users/:userId/profile', ({ params }) =>
    users._userId.profile.handleGet({ params }),
  )

  return app
}

export default createRouter
