// Auto-generated types from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import type { Body_create_local_test_agent_run_api_debug_test_agent_run_post, HTTPValidationError } from '../../../../../shared-types'
import { Body_create_local_test_agent_run_api_debug_test_agent_run_postSchema, HTTPValidationErrorSchema } from '../../../../../shared-types'


import { z } from 'zod'

export type PostBody = unknown

export const PostBodySchema = Body_create_local_test_agent_run_api_debug_test_agent_run_postSchema

export interface PostInput {
  body: PostBody
}

export const PostInputSchema = z.object({
  body: z.unknown()
})

export type PostOutput = unknown
