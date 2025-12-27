// Auto-generated FavoriteAddRequest type from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import { z } from 'zod'

export const FavoriteAddRequestSchema = z.object({
  entity_type: z.string(),
  entity_id: z.string()
})

export type FavoriteAddRequest = z.infer<typeof FavoriteAddRequestSchema>
