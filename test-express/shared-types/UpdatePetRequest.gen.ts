// Auto-generated UpdatePetRequest type from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import { z } from 'zod'

export const UpdatePetRequestSchema = z.object({
  name: z.string().optional(),
  tag: z.string().optional(),
  status: z.enum(['available', 'pending', 'sold']).optional(),
})

export type UpdatePetRequest = z.infer<typeof UpdatePetRequestSchema>
