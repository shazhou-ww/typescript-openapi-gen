// Auto-generated types from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import type { ValidationError } from '../../../../../../shared-types'
import { ValidationErrorSchema } from '../../../../../../shared-types'

import { z } from 'zod'

export interface GetParams {
  params: {
    schema_path: string
  }
}

export const GetParamsSchema = z.object({
  params: z.object({
    schema_path: z.string(),
  }),
})

export interface GetInput {
  params: GetParams
}

export const GetInputSchema = z.object({
  params: GetParamsSchema,
})

export type GetOutput = unknown
