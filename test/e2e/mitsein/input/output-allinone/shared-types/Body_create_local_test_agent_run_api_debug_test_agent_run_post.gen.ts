// Auto-generated Body_create_local_test_agent_run_api_debug_test_agent_run_post type from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import { z } from 'zod'

export const Body_create_local_test_agent_run_api_debug_test_agent_run_postSchema =
  z.object({
    account_id: z.string(),
    prompt: z.string(),
  })

export type Body_create_local_test_agent_run_api_debug_test_agent_run_post =
  z.infer<
    typeof Body_create_local_test_agent_run_api_debug_test_agent_run_postSchema
  >
