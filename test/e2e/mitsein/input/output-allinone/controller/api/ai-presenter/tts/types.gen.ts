// Auto-generated types from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import type { ValidationError } from '../../../../shared-types'
import { ValidationErrorSchema } from '../../../../shared-types'

import { z } from 'zod'

export type PostBody = unknown

export const PostBodySchema = z.object({
  speaker_id: z.string(),
  script_text: z.string(),
  slide_filename: z.string(),
  project_id: z.string(),
  language: z.union([z.string(), z.unknown()]).optional(),
})

export interface PostInput {
  body: PostBody
}

export const PostInputSchema = z.object({
  body: z.unknown(),
})

export type PostOutput = {
  success: boolean
  error?: string | unknown
}
