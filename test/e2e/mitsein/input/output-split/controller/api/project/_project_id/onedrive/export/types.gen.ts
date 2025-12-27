// Auto-generated types from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import type { ValidationError.yaml } from '../../../../../../shared-types'
import { ValidationError.yamlSchema } from '../../../../../../shared-types'


import { z } from 'zod'

export interface PostParams {
  params: {
    project_id: string
  }
}

export interface PostHeaders {
  'user-token'?: string | unknown
}

export const PostParamsSchema = z.object({
  params: z.object({
    project_id: z.string()
  })
})

export const PostHeadersSchema = z.object({
    'user-token': z.union([z.string(), z.unknown()]).optional()
})

export interface PostInput {
  params: PostParams
  headers: PostHeaders
}

export const PostInputSchema = z.object({
  params: PostParamsSchema,
  headers: PostHeadersSchema
})

export type PostOutput = unknown
