// Auto-generated types from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import type { HTTPValidationError } from '../../../../../shared-types'
import { HTTPValidationErrorSchema } from '../../../../../shared-types'


import { z } from 'zod'

export interface GetParams {
  params: {
    project_id: string
  }
}

export const GetParamsSchema = z.object({
  params: z.object({
    project_id: z.string()
  })
})

export interface GetInput {
  params: GetParams
}

export const GetInputSchema = z.object({
  params: GetParamsSchema
})

export type GetOutput = unknown
