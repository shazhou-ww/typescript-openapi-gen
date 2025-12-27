// Auto-generated types from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import type { ValidationError } from '../../../../../../shared-types'
import { ValidationErrorSchema } from '../../../../../../shared-types'

import { z } from 'zod'

export interface PostParams {
  params: {
    project_id: string
  }
}

export type PostBody = unknown

export const PostParamsSchema = z.object({
  params: z.object({
    project_id: z.string(),
  }),
})

export const PostBodySchema = z.object({
  file_paths: z.array(z.string()),
})

export interface PostInput {
  params: PostParams
  body: PostBody
}

export const PostInputSchema = z.object({
  params: PostParamsSchema,
  body: z.unknown(),
})

export type PostOutput = unknown
