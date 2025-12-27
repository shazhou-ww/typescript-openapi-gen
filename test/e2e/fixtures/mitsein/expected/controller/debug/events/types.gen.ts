// Auto-generated types from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import type {
  EventBatchRequest,
  HTTPValidationError,
} from '../../../shared-types'
import {
  EventBatchRequestSchema,
  HTTPValidationErrorSchema,
} from '../../../shared-types'

import { z } from 'zod'

export type PostBody = unknown

export const PostBodySchema = EventBatchRequestSchema

export interface PostInput {
  body: PostBody
}

export const PostInputSchema = z.object({
  body: z.unknown()
})

export type PostOutput = unknown
