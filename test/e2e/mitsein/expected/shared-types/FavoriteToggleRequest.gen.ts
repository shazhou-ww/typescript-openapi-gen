// Auto-generated FavoriteToggleRequest type from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import { z } from 'zod'

export const FavoriteToggleRequestSchema = z.object({
  entity_type: z.string(),
  entity_id: z.string()
})

export type FavoriteToggleRequest = z.infer<typeof FavoriteToggleRequestSchema>
