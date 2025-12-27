// Auto-generated ThreadGetRequest type from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import { z } from 'zod'

export const ThreadGetRequestSchema = z.object({
  thread_id: z.string().optional()
})

export type ThreadGetRequest = z.infer<typeof ThreadGetRequestSchema>
