// Auto-generated types from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import type { ValidationError } from '../../../shared-types'
import { ValidationErrorSchema } from '../../../shared-types'

import { z } from 'zod'

export type PostBody = unknown

export const PostBodySchema = z.object({
  message: z.string(),
  stream: z.boolean().optional(),
  include_context: z.boolean().optional(),
  page_context: z.string().optional(),
  thread_id: z.union([z.string(), z.unknown()]).optional(),
})

export interface PostInput {
  body: PostBody
}

export const PostInputSchema = z.object({
  body: z.unknown(),
})

export type PostOutput = unknown
