// Auto-generated types from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import type {
  HTTPValidationError,
  VideoGenerationResponse,
} from '../../../../shared-types'
import {
  HTTPValidationErrorSchema,
  VideoGenerationResponseSchema,
} from '../../../../shared-types'

import { z } from 'zod'

export type PostInput = {}
export const PostInputSchema = z.object({})

export type PostOutput = VideoGenerationResponse
