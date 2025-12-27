// Auto-generated types from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import type { ValidationError } from '../../../../../shared-types'
import { ValidationErrorSchema } from '../../../../../shared-types'

import { z } from 'zod'

export interface PostParams {
  params: {
    connector_id: string
  }
}

export type PostBody = unknown

export const PostParamsSchema = z.object({
  params: z.object({
    connector_id: z.string(),
  }),
})

export const PostBodySchema = z.object({
  redirect_uri: z.string(),
  scopes: z.union([z.array(z.string()), z.unknown()]).optional(),
  account_label: z.union([z.string(), z.unknown()]).optional(),
})

export interface PostInput {
  params: PostParams
  body: PostBody
}

export const PostInputSchema = z.object({
  params: PostParamsSchema,
  body: z.unknown(),
})

export type PostOutput = {
  authorization_url: string
  state: string
  connector_id: string
}
