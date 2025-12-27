// Auto-generated types from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import type { ValidationError } from '../../../../../shared-types'
import { ValidationErrorSchema } from '../../../../../shared-types'

import { z } from 'zod'

export interface PostQuery {
  summarize?: boolean
}

export const PostQuerySchema = z.object({
  summarize: z.boolean().optional(),
})

export interface PostInput {
  query: PostQuery
}

export const PostInputSchema = z.object({
  query: PostQuerySchema,
})

export type PostOutput = unknown
