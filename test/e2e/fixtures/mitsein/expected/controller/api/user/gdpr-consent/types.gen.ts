// Auto-generated types from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import type {
  HTTPValidationError,
  UpdateGdprConsentRequest,
} from '../../../../shared-types'
import {
  HTTPValidationErrorSchema,
  UpdateGdprConsentRequestSchema,
} from '../../../../shared-types'

import { z } from 'zod'

export type GetInput = {}
export const GetInputSchema = z.object({})

export type GetOutput = unknown

export type PostBody = unknown

export const PostBodySchema = UpdateGdprConsentRequestSchema

export interface PostInput {
  body: PostBody
}

export const PostInputSchema = z.object({
  body: z.unknown()
})

export type PostOutput = unknown
