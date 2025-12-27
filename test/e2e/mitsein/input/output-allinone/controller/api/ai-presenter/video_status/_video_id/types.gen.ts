// Auto-generated types from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import type { ValidationError } from '../../../../../shared-types'
import { ValidationErrorSchema } from '../../../../../shared-types'

import { z } from 'zod'

export interface GetParams {
  params: {
    video_id: string
  }
}

export const GetParamsSchema = z.object({
  params: z.object({
    video_id: z.string(),
  }),
})

export interface GetInput {
  params: GetParams
}

export const GetInputSchema = z.object({
  params: GetParamsSchema,
})

export type GetOutput = {
  success: boolean
  video_id?: string | unknown
  video_url?: string | unknown
  thumbnail_url?: string | unknown
  duration?: number | unknown
  status: string
  error?: string | unknown
  message: string
}
