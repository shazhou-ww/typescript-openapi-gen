// Auto-generated ListMessagesRequest type from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import { z } from 'zod'

export const ListMessagesRequestSchema = z.object({
  thread_id: z.string().optional(),
})

export type ListMessagesRequest = z.infer<typeof ListMessagesRequestSchema>
