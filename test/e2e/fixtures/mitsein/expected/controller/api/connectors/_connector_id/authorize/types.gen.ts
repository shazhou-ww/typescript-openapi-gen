// Auto-generated types from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import type {
  HTTPValidationError,
  OAuthInitiateRequest,
  OAuthInitiateResponse,
} from '../../../../../shared-types'
import {
  HTTPValidationErrorSchema,
  OAuthInitiateRequestSchema,
  OAuthInitiateResponseSchema,
} from '../../../../../shared-types'

import { z } from 'zod'

export interface PostParams {
  params: {
    connector_id: string
  }
}

export type PostBody = unknown

export const PostParamsSchema = z.object({
  params: z.object({
    connector_id: z.string()
  })
})

export const PostBodySchema = OAuthInitiateRequestSchema

export interface PostInput {
  params: PostParams
  body: PostBody
}

export const PostInputSchema = z.object({
  params: PostParamsSchema,
  body: z.unknown()
})

export type PostOutput = OAuthInitiateResponse
