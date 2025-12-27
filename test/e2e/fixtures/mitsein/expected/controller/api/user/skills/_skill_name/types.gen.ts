// Auto-generated types from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import type { HTTPValidationError } from '../../../../../shared-types'
import { HTTPValidationErrorSchema } from '../../../../../shared-types'

import { z } from 'zod'

export interface GetParams {
  params: {
    skill_name: string
  }
}

export const GetParamsSchema = z.object({
  params: z.object({
    skill_name: z.string()
  })
})

export interface GetInput {
  params: GetParams
}

export const GetInputSchema = z.object({
  params: GetParamsSchema
})

export type GetOutput = unknown

export interface DeleteParams {
  params: {
    skill_name: string
  }
}

export const DeleteParamsSchema = z.object({
  params: z.object({
    skill_name: z.string()
  })
})

export interface DeleteInput {
  params: DeleteParams
}

export const DeleteInputSchema = z.object({
  params: DeleteParamsSchema
})

export type DeleteOutput = unknown
