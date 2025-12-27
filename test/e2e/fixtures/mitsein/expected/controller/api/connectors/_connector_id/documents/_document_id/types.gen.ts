// Auto-generated types from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import type {
  DocumentReadResponse,
  HTTPValidationError,
} from '../../../../../../shared-types'
import {
  DocumentReadResponseSchema,
  HTTPValidationErrorSchema,
} from '../../../../../../shared-types'

import { z } from 'zod'

export interface GetParams {
  params: {
    connector_id: string
    document_id: string
  }
}

export interface GetQuery {
  include_raw?: boolean
}

export const GetParamsSchema = z.object({
  params: z.object({
    connector_id: z.string(),
    document_id: z.string()
  })
})

export const GetQuerySchema = z.object({
    include_raw: z.boolean().optional()
})

export interface GetInput {
  params: GetParams
  query: GetQuery
}

export const GetInputSchema = z.object({
  params: GetParamsSchema,
  query: GetQuerySchema
})

export type GetOutput = DocumentReadResponse
