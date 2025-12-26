// Auto-generated types from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import type { HTTPValidationError } from '../../../../../shared-types'
import { HTTPValidationErrorSchema } from '../../../../../shared-types'


import { z } from 'zod'

export interface GetParams {
  params: {
    agent_run_id: string
  }
}

export interface GetQuery {
  event_type?: string | unknown
}

export const GetParamsSchema = z.object({
  params: z.object({
    agent_run_id: z.string()
  })
})

export const GetQuerySchema = z.object({
    event_type: z.union([z.string(), z.unknown()]).optional()
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
