// Auto-generated PaginationResponse type from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import { z } from 'zod'

export const PaginationResponseSchema = z.object({
  data: z.unknown().optional(),
  has_more: z.boolean().optional(),
  error: z.union([z.string(), z.unknown()]).optional(),
})

export type PaginationResponse = z.infer<typeof PaginationResponseSchema>
