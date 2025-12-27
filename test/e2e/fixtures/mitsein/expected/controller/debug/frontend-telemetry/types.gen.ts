// Auto-generated types from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import type { HTTPValidationError } from '../../../shared-types'
import { HTTPValidationErrorSchema } from '../../../shared-types'

import { z } from 'zod'

export interface GetQuery {
  thread_id?: string
  minutes?: number
}

export const GetQuerySchema = z.object({
    thread_id: z.string().optional(),
    minutes: z.number().int().optional()
})

export interface GetInput {
  query: GetQuery
}

export const GetInputSchema = z.object({
  query: GetQuerySchema
})

export type GetOutput = unknown

export type PostInput = {}
export const PostInputSchema = z.object({})

export type PostOutput = unknown
