// Auto-generated types from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import type { ValidationError } from '../../../../shared-types'
import { ValidationErrorSchema } from '../../../../shared-types'

import { z } from 'zod'

export interface GetParams {
  params: {
    trigger_id: string
  }
}

export const GetParamsSchema = z.object({
  params: z.object({
    trigger_id: z.string(),
  }),
})

export interface GetInput {
  params: GetParams
}

export const GetInputSchema = z.object({
  params: GetParamsSchema,
})

export type GetOutput = unknown

export interface PostParams {
  params: {
    trigger_id: string
  }
}

export type PostBody = unknown

export const PostParamsSchema = z.object({
  params: z.object({
    trigger_id: z.string(),
  }),
})

export const PostBodySchema = z.object({
  name: z.union([z.string(), z.unknown()]).optional(),
  description: z.union([z.string(), z.unknown()]).optional(),
  config: z.union([z.record(z.unknown()), z.unknown()]).optional(),
  is_active: z.union([z.boolean(), z.unknown()]).optional(),
})

export interface PostInput {
  params: PostParams
  body: PostBody
}

export const PostInputSchema = z.object({
  params: PostParamsSchema,
  body: z.unknown(),
})

export type PostOutput = unknown
