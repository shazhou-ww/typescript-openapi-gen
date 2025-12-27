// Auto-generated types from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import type { ValidationError } from '../../../../shared-types'
import { ValidationErrorSchema } from '../../../../shared-types'

import { z } from 'zod'

export type PostInput = {}
export const PostInputSchema = z.object({})

export type PostOutput = {
  success: boolean
  video_id?: string | unknown
  video_url?: string | unknown
  thumbnail_url?: string | unknown
  duration?: number | unknown
  status: string
  error?: string | unknown
  message: string
}
