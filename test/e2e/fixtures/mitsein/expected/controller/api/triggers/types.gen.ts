// Auto-generated types from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import type {
  CreateTriggerApiRequest,
  HTTPValidationError,
} from '../../../shared-types'
import {
  CreateTriggerApiRequestSchema,
  HTTPValidationErrorSchema,
} from '../../../shared-types'

import { z } from 'zod'

export type GetInput = {}
export const GetInputSchema = z.object({})

export type GetOutput = unknown

export type PostBody = unknown

export const PostBodySchema = CreateTriggerApiRequestSchema

export interface PostInput {
  body: PostBody
}

export const PostInputSchema = z.object({
  body: z.unknown()
})

export type PostOutput = unknown
