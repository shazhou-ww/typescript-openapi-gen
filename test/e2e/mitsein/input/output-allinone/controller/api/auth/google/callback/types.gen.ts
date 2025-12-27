// Auto-generated types from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import type { ValidationError } from '../../../../../shared-types'
import { ValidationErrorSchema } from '../../../../../shared-types'

import { z } from 'zod'

export interface GetQuery {
  code: string
  state: string
}

export const GetQuerySchema = z.object({
  code: z.string(),
  state: z.string(),
})

export interface GetInput {
  query: GetQuery
}

export const GetInputSchema = z.object({
  query: GetQuerySchema,
})

export type GetOutput = {
  success: boolean
  user_info?: Record<string, unknown> | unknown
  access_token?: string | unknown
  id_token?: string | unknown
  expires_in?: number | unknown
  error?: string | unknown
}
