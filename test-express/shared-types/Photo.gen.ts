// Auto-generated Photo type from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import { z } from 'zod'

export const PhotoSchema = z.object({
  id: z.string(),
  url: z.string(),
  caption: z.string().optional(),
})

export type Photo = z.infer<typeof PhotoSchema>
