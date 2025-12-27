// Auto-generated types from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import type {
  BatchDownloadRequest,
  HTTPValidationError,
} from '../../../../../../shared-types'
import {
  BatchDownloadRequestSchema,
  HTTPValidationErrorSchema,
} from '../../../../../../shared-types'

import { z } from 'zod'

export interface PostParams {
  params: {
    project_id: string
  }
}

export type PostBody = unknown

export const PostParamsSchema = z.object({
  params: z.object({
    project_id: z.string()
  })
})

export const PostBodySchema = BatchDownloadRequestSchema

export interface PostInput {
  params: PostParams
  body: PostBody
}

export const PostInputSchema = z.object({
  params: PostParamsSchema,
  body: z.unknown()
})

export type PostOutput = unknown
