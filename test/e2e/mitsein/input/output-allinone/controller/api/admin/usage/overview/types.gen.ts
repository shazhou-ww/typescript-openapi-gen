// Auto-generated types from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import type { ValidationError } from '../../../../../shared-types'
import { ValidationErrorSchema } from '../../../../../shared-types'

import { z } from 'zod'

export interface GetQuery {
  start_date?: string | unknown
  end_date?: string | unknown
}

export const GetQuerySchema = z.object({
  start_date: z.union([z.string(), z.unknown()]).optional(),
  end_date: z.union([z.string(), z.unknown()]).optional(),
})

export interface GetInput {
  query: GetQuery
}

export const GetInputSchema = z.object({
  query: GetQuerySchema,
})

export type GetOutput = unknown
