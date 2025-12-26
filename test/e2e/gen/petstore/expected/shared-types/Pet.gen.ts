// Auto-generated Pet type from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import { z } from 'zod'

export const PetSchema = z.object({
  id: z.string(),
  name: z.string(),
  tag: z.string().optional(),
  status: z.enum(['available', 'pending', 'sold']).optional(),
})

export type Pet = z.infer<typeof PetSchema>
