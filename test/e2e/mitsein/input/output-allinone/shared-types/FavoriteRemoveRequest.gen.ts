// Auto-generated FavoriteRemoveRequest type from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import { z } from 'zod'

export const FavoriteRemoveRequestSchema = z.object({
  entity_type: z.string(),
  entity_id: z.string(),
})

export type FavoriteRemoveRequest = z.infer<typeof FavoriteRemoveRequestSchema>
