// Auto-generated types from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import type { HTTPValidationError } from '../../../../../../shared-types'
import { HTTPValidationErrorSchema } from '../../../../../../shared-types'

import { z } from 'zod'

export interface PostParams {
  params: {
    project_id: string
  }
}

export const PostParamsSchema = z.object({
  params: z.object({
    project_id: z.string()
  })
})

export interface PostInput {
  params: PostParams
}

export const PostInputSchema = z.object({
  params: PostParamsSchema
})

export type PostOutput = unknown
