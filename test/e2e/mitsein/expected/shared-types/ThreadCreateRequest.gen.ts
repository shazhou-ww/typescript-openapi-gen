// Auto-generated ThreadCreateRequest type from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import { z } from 'zod'

export const ThreadCreateRequestSchema = z.object({
  project_id: z.string().optional()
})

export type ThreadCreateRequest = z.infer<typeof ThreadCreateRequestSchema>
