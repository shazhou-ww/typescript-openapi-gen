// Auto-generated Body_start_agent_api_v2_thread__thread_id__agent_start_post type from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import { z } from 'zod'

export const Body_start_agent_api_v2_thread__thread_id__agent_start_postSchema = z.object({
  enable_thinking: z.union([z.boolean(), z.unknown()]).optional(),
  reasoning_effort: z.union([z.string(), z.unknown()]).optional(),
  stream: z.union([z.boolean(), z.unknown()]).optional(),
  enable_context_manager: z.union([z.boolean(), z.unknown()]).optional(),
  enable_tracing: z.union([z.boolean(), z.unknown()]).optional(),
  mcp_servers: z.union([z.string(), z.unknown()]).optional(),
  role: z.union([z.string(), z.unknown()]).optional(),
  temperature: z.union([z.number(), z.unknown()]).optional(),
  max_tokens: z.union([z.number().int(), z.unknown()]).optional()
})

export type Body_start_agent_api_v2_thread__thread_id__agent_start_post = z.infer<typeof Body_start_agent_api_v2_thread__thread_id__agent_start_postSchema>
