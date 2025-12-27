// Auto-generated types from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import type { FileSummarizationPreferences, HTTPValidationError } from '../../../../../shared-types'
import { FileSummarizationPreferencesSchema, HTTPValidationErrorSchema } from '../../../../../shared-types'


import { z } from 'zod'

export type GetInput = {}
export const GetInputSchema = z.object({})

export type GetOutput = FileSummarizationPreferences

export type PostBody = unknown

export const PostBodySchema = FileSummarizationPreferencesSchema

export interface PostInput {
  body: PostBody
}

export const PostInputSchema = z.object({
  body: z.unknown()
})

export type PostOutput = Record<string, unknown>
