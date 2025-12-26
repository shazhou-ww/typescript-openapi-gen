// Auto-generated types from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import type { HTTPValidationError } from '../../../../../shared-types'
import { HTTPValidationErrorSchema } from '../../../../../shared-types'


import { z } from 'zod'

export interface PostQuery {
  summarize?: boolean
}

export const PostQuerySchema = z.object({
    summarize: z.boolean().optional()
})

export interface PostInput {
  query: PostQuery
}

export const PostInputSchema = z.object({
  query: PostQuerySchema
})

export type PostOutput = unknown
