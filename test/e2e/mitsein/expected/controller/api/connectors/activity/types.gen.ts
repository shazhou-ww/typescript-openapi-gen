// Auto-generated types from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import type { HTTPValidationError } from '../../../../shared-types'
import { HTTPValidationErrorSchema } from '../../../../shared-types'


import { z } from 'zod'

export interface GetQuery {
  limit?: number
  offset?: number
}

export const GetQuerySchema = z.object({
    limit: z.number().int().optional(),
    offset: z.number().int().optional()
})

export interface GetInput {
  query: GetQuery
}

export const GetInputSchema = z.object({
  query: GetQuerySchema
})

export type GetOutput = unknown
