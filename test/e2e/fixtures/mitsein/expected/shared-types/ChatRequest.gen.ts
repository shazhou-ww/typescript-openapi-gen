// Auto-generated ChatRequest type from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import { z } from 'zod'

export const ChatRequestSchema = z.object({
  message: z.string(),
  stream: z.boolean().optional(),
  include_context: z.boolean().optional(),
  page_context: z.string().optional(),
  thread_id: z.union([z.string(), z.unknown()]).optional(),
})

export type ChatRequest = z.infer<typeof ChatRequestSchema>
