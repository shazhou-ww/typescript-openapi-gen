// Auto-generated types from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import type { HTTPValidationError } from '../../../../shared-types'
import { HTTPValidationErrorSchema } from '../../../../shared-types'


import { z } from 'zod'

export interface PostQuery {
  document_name?: string | unknown
  max_tokens?: number | unknown
}

export const PostQuerySchema = z.object({
    document_name: z.union([z.string(), z.unknown()]).optional(),
    max_tokens: z.union([z.number().int(), z.unknown()]).optional()
})

export interface PostInput {
  query: PostQuery
}

export const PostInputSchema = z.object({
  query: PostQuerySchema
})

export type PostOutput = Record<string, unknown>
