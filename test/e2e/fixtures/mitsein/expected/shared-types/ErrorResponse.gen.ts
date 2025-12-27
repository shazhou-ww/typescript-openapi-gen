// Auto-generated ErrorResponse type from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import { z } from 'zod'

export const ErrorResponseSchema = z.object({
  code: z.string().optional(),
  detail: z.string(),
  status_code: z.number().int().optional()
})

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>
