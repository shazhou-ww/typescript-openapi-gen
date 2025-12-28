// Auto-generated types from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import type {
  HTTPValidationError,
  ToggleTriggerRequest,
} from '../../../../../shared-types'
import {
  HTTPValidationErrorSchema,
  ToggleTriggerRequestSchema,
} from '../../../../../shared-types'

import { z } from 'zod'

export interface PostParams {
  params: {
    trigger_id: string
  }
}

export type PostBody = unknown

export const PostParamsSchema = z.object({
  params: z.object({
    trigger_id: z.string(),
  }),
})

export const PostBodySchema = ToggleTriggerRequestSchema

export interface PostInput {
  params: PostParams
  body: PostBody
}

export const PostInputSchema = z.object({
  params: PostParamsSchema,
  body: z.unknown(),
})

export type PostOutput = unknown
