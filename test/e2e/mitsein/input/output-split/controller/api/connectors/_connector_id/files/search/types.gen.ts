// Auto-generated types from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import type { ValidationError.yaml } from '../../../../../../shared-types'
import { ValidationError.yamlSchema } from '../../../../../../shared-types'


import { z } from 'zod'

export interface GetParams {
  params: {
    connector_id: string
  }
}

export interface GetQuery {
  query: string
  page_size?: number
}

export const GetParamsSchema = z.object({
  params: z.object({
    connector_id: z.string()
  })
})

export const GetQuerySchema = z.object({
    query: z.string(),
    page_size: z.number().int().min(1).max(1000).optional()
})

export interface GetInput {
  params: GetParams
  query: GetQuery
}

export const GetInputSchema = z.object({
  params: GetParamsSchema,
  query: GetQuerySchema
})

export type GetOutput = void
