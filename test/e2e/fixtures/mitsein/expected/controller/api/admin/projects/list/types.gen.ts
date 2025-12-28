// Auto-generated types from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import type { HTTPValidationError } from '../../../../../shared-types'
import { HTTPValidationErrorSchema } from '../../../../../shared-types'

import { z } from 'zod'

export interface GetQuery {
  page?: number
  page_size?: number
  order_by?: string
  desc?: boolean
}

export const GetQuerySchema = z.object({
  page: z.number().int().min(1).optional(),
  page_size: z.number().int().min(1).max(200).optional(),
  order_by: z.string().optional(),
  desc: z.boolean().optional(),
})

export interface GetInput {
  query: GetQuery
}

export const GetInputSchema = z.object({
  query: GetQuerySchema,
})

export type GetOutput = unknown
