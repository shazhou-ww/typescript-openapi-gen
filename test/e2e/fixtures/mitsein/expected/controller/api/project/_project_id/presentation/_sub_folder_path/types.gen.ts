// Auto-generated types from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import type { HTTPValidationError } from '../../../../../../shared-types'
import { HTTPValidationErrorSchema } from '../../../../../../shared-types'


import { z } from 'zod'

export interface GetParams {
  params: {
    project_id: string
    sub_folder_path: string
  }
}

export interface GetQuery {
  open_in_onedrive?: boolean
}

export interface GetHeaders {
  'user-token'?: string | unknown
}

export const GetParamsSchema = z.object({
  params: z.object({
    project_id: z.string(),
    sub_folder_path: z.string()
  })
})

export const GetQuerySchema = z.object({
    open_in_onedrive: z.boolean().optional()
})

export const GetHeadersSchema = z.object({
    'user-token': z.union([z.string(), z.unknown()]).optional()
})

export interface GetInput {
  params: GetParams
  query: GetQuery
  headers: GetHeaders
}

export const GetInputSchema = z.object({
  params: GetParamsSchema,
  query: GetQuerySchema,
  headers: GetHeadersSchema
})

export type GetOutput = unknown
