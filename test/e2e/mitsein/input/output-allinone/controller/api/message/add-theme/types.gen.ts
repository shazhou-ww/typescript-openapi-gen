// Auto-generated types from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import type { ValidationError } from '../../../../shared-types'
import { ValidationErrorSchema } from '../../../../shared-types'

import { z } from 'zod'

export type PostBody = unknown

export const PostBodySchema = z.object({
  thread_id: z.string().optional(),
  type: z.string().optional(),
  is_llm_message: z.boolean().optional(),
  theme_name: z.string().optional(),
  format_type: z.string().optional(),
})

export interface PostInput {
  body: PostBody
}

export const PostInputSchema = z.object({
  body: z.unknown(),
})

export type PostOutput = unknown
