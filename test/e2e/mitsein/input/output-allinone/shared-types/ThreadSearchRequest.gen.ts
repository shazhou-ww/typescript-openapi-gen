// Auto-generated ThreadSearchRequest type from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import { z } from 'zod'

export const ThreadSearchRequestSchema = z.object({
  keyword: z.string().optional(),
  offset: z.number().int().optional(),
  limit: z.number().int().optional(),
})

export type ThreadSearchRequest = z.infer<typeof ThreadSearchRequestSchema>
