// Auto-generated types from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import type { HTTPValidationError } from '../../../../../shared-types'
import { HTTPValidationErrorSchema } from '../../../../../shared-types'

import { z } from 'zod'

export interface GetQuery {
  export_format?: string
  start_date?: string | unknown
  end_date?: string | unknown
  provider?: string | unknown
  model?: string | unknown
  task_type?: string | unknown
  status?: string | unknown
  limit?: number
}

export const GetQuerySchema = z.object({
  export_format: z
    .string()
    .regex(/^(csv|json)$/)
    .optional(),
  start_date: z.union([z.string(), z.unknown()]).optional(),
  end_date: z.union([z.string(), z.unknown()]).optional(),
  provider: z.union([z.string(), z.unknown()]).optional(),
  model: z.union([z.string(), z.unknown()]).optional(),
  task_type: z.union([z.string(), z.unknown()]).optional(),
  status: z.union([z.string(), z.unknown()]).optional(),
  limit: z.number().int().min(1).max(5000).optional(),
})

export interface GetInput {
  query: GetQuery
}

export const GetInputSchema = z.object({
  query: GetQuerySchema,
})

export type GetOutput = unknown
