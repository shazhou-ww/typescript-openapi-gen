// Auto-generated types from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import type { HTTPValidationError } from '../../../../../../shared-types'
import { HTTPValidationErrorSchema } from '../../../../../../shared-types'


import { z } from 'zod'

export interface GetParams {
  params: {
    project_id: string
  }
}

export interface GetQuery {
  port?: number
}

export const GetParamsSchema = z.object({
  params: z.object({
    project_id: z.string()
  })
})

export const GetQuerySchema = z.object({
    port: z.number().int().optional()
})

export interface GetInput {
  params: GetParams
  query: GetQuery
}

export const GetInputSchema = z.object({
  params: GetParamsSchema,
  query: GetQuerySchema
})

export type GetOutput = unknown
