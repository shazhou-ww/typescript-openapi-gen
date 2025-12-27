// Auto-generated types from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import type {
  HTTPValidationError,
  UpdateTriggerRequest,
} from '../../../../shared-types'
import {
  HTTPValidationErrorSchema,
  UpdateTriggerRequestSchema,
} from '../../../../shared-types'

import { z } from 'zod'

export interface GetParams {
  params: {
    trigger_id: string
  }
}

export const GetParamsSchema = z.object({
  params: z.object({
    trigger_id: z.string()
  })
})

export interface GetInput {
  params: GetParams
}

export const GetInputSchema = z.object({
  params: GetParamsSchema
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
    trigger_id: z.string()
  })
})

export const PostBodySchema = UpdateTriggerRequestSchema

export interface PostInput {
  params: PostParams
  body: PostBody
}

export const PostInputSchema = z.object({
  params: PostParamsSchema,
  body: z.unknown()
})

export type PostOutput = unknown
