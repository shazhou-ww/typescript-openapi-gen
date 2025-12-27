// Auto-generated types from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import type { ValidationError } from '../../../../../shared-types'
import { ValidationErrorSchema } from '../../../../../shared-types'

import { z } from 'zod'

export interface GetParams {
  params: {
    project_id: string
  }
}

export interface GetQuery {
  path: string
}

export const GetParamsSchema = z.object({
  params: z.object({
    project_id: z.string(),
  }),
})

export const GetQuerySchema = z.object({
  path: z.string(),
})

export interface GetInput {
  params: GetParams
  query: GetQuery
}

export const GetInputSchema = z.object({
  params: GetParamsSchema,
  query: GetQuerySchema,
})

export type GetOutput = unknown

export interface PostParams {
  params: {
    project_id: string
  }
}

export const PostParamsSchema = z.object({
  params: z.object({
    project_id: z.string(),
  }),
})

export interface PostInput {
  params: PostParams
}

export const PostInputSchema = z.object({
  params: PostParamsSchema,
})

export type PostOutput = unknown

export interface DeleteParams {
  params: {
    project_id: string
  }
}

export interface DeleteQuery {
  path: string
}

export const DeleteParamsSchema = z.object({
  params: z.object({
    project_id: z.string(),
  }),
})

export const DeleteQuerySchema = z.object({
  path: z.string(),
})

export interface DeleteInput {
  params: DeleteParams
  query: DeleteQuery
}

export const DeleteInputSchema = z.object({
  params: DeleteParamsSchema,
  query: DeleteQuerySchema,
})

export type DeleteOutput = unknown
