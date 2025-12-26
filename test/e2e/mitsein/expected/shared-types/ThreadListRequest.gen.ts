// Auto-generated ThreadListRequest type from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import { z } from 'zod'

export const ThreadListRequestSchema = z.object({
  offset: z.number().int().optional(),
  limit: z.number().int().optional()
})

export type ThreadListRequest = z.infer<typeof ThreadListRequestSchema>
