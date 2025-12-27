// Auto-generated VolcengineBaseResponse type from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import { z } from 'zod'

export const VolcengineBaseResponseSchema = z.object({
  success: z.boolean(),
  error: z.union([z.string(), z.unknown()]).optional()
})

export type VolcengineBaseResponse = z.infer<typeof VolcengineBaseResponseSchema>
