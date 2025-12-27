// Auto-generated PaginationRequest type from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import { z } from 'zod'

export const PaginationRequestSchema = z.object({
  offset: z.number().int().min(0).optional(),
  limit: z.number().int().min(1).max(100).optional(),
})

export type PaginationRequest = z.infer<typeof PaginationRequestSchema>
