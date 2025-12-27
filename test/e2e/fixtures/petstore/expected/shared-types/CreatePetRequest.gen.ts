// Auto-generated CreatePetRequest type from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import { z } from 'zod'

export const CreatePetRequestSchema = z.object({
  name: z.string(),
  tag: z.string().optional(),
})

export type CreatePetRequest = z.infer<typeof CreatePetRequestSchema>
