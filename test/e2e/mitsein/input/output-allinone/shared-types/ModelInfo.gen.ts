// Auto-generated ModelInfo type from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import { z } from 'zod'

export const ModelInfoSchema = z.object({
  name: z.string(),
  label: z.string(),
  is_default: z.boolean().optional(),
  is_fallback: z.boolean().optional(),
})

export type ModelInfo = z.infer<typeof ModelInfoSchema>
