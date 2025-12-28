// Auto-generated GenerateSuggestionsRequest type from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import { z } from 'zod'

export const GenerateSuggestionsRequestSchema = z.object({
  thread_id: z.string().optional(),
  limit: z.number().int().optional(),
})

export type GenerateSuggestionsRequest = z.infer<
  typeof GenerateSuggestionsRequestSchema
>
