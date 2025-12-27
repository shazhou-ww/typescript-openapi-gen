// Auto-generated MessageAddRequestBody type from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import { z } from 'zod'

export const MessageAddRequestBodySchema = z.object({
  thread_id: z.string(),
  message_type: z.string().optional(),
  is_llm_message: z.boolean().optional(),
  content: z.string(),
  metadata: z.string().optional(),
  files: z.array(z.string()).optional()
})

export type MessageAddRequestBody = z.infer<typeof MessageAddRequestBodySchema>
