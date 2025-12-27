// Auto-generated types from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import type { ValidationError } from '../../../../../../shared-types'
import { ValidationErrorSchema } from '../../../../../../shared-types'

import { z } from 'zod'

export interface GetParams {
  params: {
    project_id: string
  }
}

export interface GetQuery {
  file_path: string
  is_user_uploaded: boolean
}

export const GetParamsSchema = z.object({
  params: z.object({
    project_id: z.string(),
  }),
})

export const GetQuerySchema = z.object({
  file_path: z.string(),
  is_user_uploaded: z.boolean(),
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
