// Auto-generated StandardResponse type from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import { z } from 'zod'

export const StandardResponseSchema = z.object({
  data: z.unknown().optional(),
  error: z.union([z.string(), z.unknown()]).optional(),
})

export type StandardResponse = z.infer<typeof StandardResponseSchema>
