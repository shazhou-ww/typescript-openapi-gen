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
  path: string
  _t?: string | unknown
}

export interface GetHeaders {
  Range?: string | unknown
}

export const GetParamsSchema = z.object({
  params: z.object({
    project_id: z.string(),
  }),
})

export const GetQuerySchema = z.object({
  path: z.string(),
  _t: z.union([z.string(), z.unknown()]).optional(),
})

export const GetHeadersSchema = z.object({
  Range: z.union([z.string(), z.unknown()]).optional(),
})

export interface GetInput {
  params: GetParams
  query: GetQuery
  headers: GetHeaders
}

export const GetInputSchema = z.object({
  params: GetParamsSchema,
  query: GetQuerySchema,
  headers: GetHeadersSchema,
})

export type GetOutput = unknown
