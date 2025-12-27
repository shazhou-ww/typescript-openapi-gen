// Auto-generated types from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import type { ValidationError } from '../../../../shared-types'
import { ValidationErrorSchema } from '../../../../shared-types'

import { z } from 'zod'

export type PostBody = unknown

export const PostBodySchema = z.object({
  user_id: z.string(),
  throttle_rule: z.record(z.unknown()),
})

export interface PostInput {
  body: PostBody
}

export const PostInputSchema = z.object({
  body: z.unknown(),
})

export type PostOutput = unknown
