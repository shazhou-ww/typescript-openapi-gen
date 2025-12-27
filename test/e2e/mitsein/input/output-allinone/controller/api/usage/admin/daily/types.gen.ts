// Auto-generated types from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import type { ValidationError } from '../../../../../shared-types'
import { ValidationErrorSchema } from '../../../../../shared-types'

import { z } from 'zod'

export interface GetQuery {
  start_date?: string | unknown
  end_date?: string | unknown
  provider?: string | unknown
  model?: string | unknown
  task_type?: string | unknown
  page?: number
  page_size?: number
}

export const GetQuerySchema = z.object({
  start_date: z.union([z.string(), z.unknown()]).optional(),
  end_date: z.union([z.string(), z.unknown()]).optional(),
  provider: z.union([z.string(), z.unknown()]).optional(),
  model: z.union([z.string(), z.unknown()]).optional(),
  task_type: z.union([z.string(), z.unknown()]).optional(),
  page: z.number().int().min(1).optional(),
  page_size: z.number().int().min(1).max(200).optional(),
})

export interface GetInput {
  query: GetQuery
}

export const GetInputSchema = z.object({
  query: GetQuerySchema,
})

export type GetOutput = unknown
