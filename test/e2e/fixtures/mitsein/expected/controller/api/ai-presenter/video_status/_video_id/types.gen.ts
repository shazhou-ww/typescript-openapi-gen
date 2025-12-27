// Auto-generated types from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import type {
  HTTPValidationError,
  VideoGenerationResponse,
} from '../../../../../shared-types'
import {
  HTTPValidationErrorSchema,
  VideoGenerationResponseSchema,
} from '../../../../../shared-types'

import { z } from 'zod'

export interface GetParams {
  params: {
    video_id: string
  }
}

export const GetParamsSchema = z.object({
  params: z.object({
    video_id: z.string()
  })
})

export interface GetInput {
  params: GetParams
}

export const GetInputSchema = z.object({
  params: GetParamsSchema
})

export type GetOutput = VideoGenerationResponse
