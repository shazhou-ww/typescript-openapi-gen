// Auto-generated ThreadIdRequest type from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import { z } from 'zod'

export const ThreadIdRequestSchema = z.object({
  thread_id: z.string(),
})

export type ThreadIdRequest = z.infer<typeof ThreadIdRequestSchema>
