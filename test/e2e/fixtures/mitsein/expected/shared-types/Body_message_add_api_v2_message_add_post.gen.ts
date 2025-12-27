// Auto-generated Body_message_add_api_v2_message_add_post type from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import { z } from 'zod'

export const Body_message_add_api_v2_message_add_postSchema = z.object({
  thread_id: z.string().optional(),
  message_type: z.string().optional(),
  is_llm_message: z.boolean().optional(),
  content: z.string().optional(),
  metadata: z.string().optional(),
  files: z.array(z.string()).optional()
})

export type Body_message_add_api_v2_message_add_post = z.infer<typeof Body_message_add_api_v2_message_add_postSchema>
