// Auto-generated types from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import type { ValidationError } from '../../../../../shared-types'
import { ValidationErrorSchema } from '../../../../../shared-types'

import { z } from 'zod'

export interface GetParams {
  params: {
    thread_id: string
  }
}

export interface GetQuery {
  limit?: number
}

export const GetParamsSchema = z.object({
  params: z.object({
    thread_id: z.string(),
  }),
})

export const GetQuerySchema = z.object({
  limit: z.number().int().optional(),
})

export interface GetInput {
  params: GetParams
  query: GetQuery
}

export const GetInputSchema = z.object({
  params: GetParamsSchema,
  query: GetQuerySchema,
})

export type GetOutput = unknown
