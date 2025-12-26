// Auto-generated types from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import type { OAuthCallbackResponse, HTTPValidationError } from '../../../../../shared-types'
import { OAuthCallbackResponseSchema, HTTPValidationErrorSchema } from '../../../../../shared-types'


import { z } from 'zod'

export interface GetParams {
  params: {
    connector_id: string
  }
}

export interface GetQuery {
  code: string
  state: string
}

export const GetParamsSchema = z.object({
  params: z.object({
    connector_id: z.string()
  })
})

export const GetQuerySchema = z.object({
    code: z.string(),
    state: z.string()
})

export interface GetInput {
  params: GetParams
  query: GetQuery
}

export const GetInputSchema = z.object({
  params: GetParamsSchema,
  query: GetQuerySchema
})

export type GetOutput = OAuthCallbackResponse
