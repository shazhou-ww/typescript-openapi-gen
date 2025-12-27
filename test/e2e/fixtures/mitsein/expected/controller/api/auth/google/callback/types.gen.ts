// Auto-generated types from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import type {
  GoogleAuthCallbackResponse,
  HTTPValidationError,
} from '../../../../../shared-types'
import {
  GoogleAuthCallbackResponseSchema,
  HTTPValidationErrorSchema,
} from '../../../../../shared-types'

import { z } from 'zod'

export interface GetQuery {
  code: string
  state: string
}

export const GetQuerySchema = z.object({
    code: z.string(),
    state: z.string()
})

export interface GetInput {
  query: GetQuery
}

export const GetInputSchema = z.object({
  query: GetQuerySchema
})

export type GetOutput = GoogleAuthCallbackResponse
