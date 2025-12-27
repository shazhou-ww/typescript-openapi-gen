// Auto-generated types from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import type {
  HTTPValidationError,
  UpdateProjectRequest,
} from '../../../../shared-types'
import {
  HTTPValidationErrorSchema,
  UpdateProjectRequestSchema,
} from '../../../../shared-types'

import { z } from 'zod'

export type PostBody = unknown

export const PostBodySchema = UpdateProjectRequestSchema

export interface PostInput {
  body: PostBody
}

export const PostInputSchema = z.object({
  body: z.unknown()
})

export type PostOutput = unknown
