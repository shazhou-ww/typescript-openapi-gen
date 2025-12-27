// Auto-generated types from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import type {
  AddThemeMessageRequest,
  HTTPValidationError,
} from '../../../../shared-types'
import {
  AddThemeMessageRequestSchema,
  HTTPValidationErrorSchema,
} from '../../../../shared-types'

import { z } from 'zod'

export type PostBody = unknown

export const PostBodySchema = AddThemeMessageRequestSchema

export interface PostInput {
  body: PostBody
}

export const PostInputSchema = z.object({
  body: z.unknown(),
})

export type PostOutput = unknown
