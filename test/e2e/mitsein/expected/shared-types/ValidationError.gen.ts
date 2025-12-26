// Auto-generated ValidationError type from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import { z } from 'zod'

export const ValidationErrorSchema = z.object({
  loc: z.array(z.union([z.string(), z.number().int()])),
  msg: z.string(),
  type: z.string()
})

export type ValidationError = z.infer<typeof ValidationErrorSchema>
