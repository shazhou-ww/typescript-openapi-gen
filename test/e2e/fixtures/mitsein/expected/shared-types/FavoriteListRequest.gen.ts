// Auto-generated FavoriteListRequest type from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import { z } from 'zod'

export const FavoriteListRequestSchema = z.object({
  entity_type: z.union([z.string(), z.unknown()]).optional(),
  offset: z.number().int().optional(),
  limit: z.number().int().optional()
})

export type FavoriteListRequest = z.infer<typeof FavoriteListRequestSchema>
