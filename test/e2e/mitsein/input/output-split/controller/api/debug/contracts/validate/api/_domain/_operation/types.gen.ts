// Auto-generated types from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import type { ValidationError.yaml } from '../../../../../../../../shared-types'
import { ValidationError.yamlSchema } from '../../../../../../../../shared-types'


import { z } from 'zod'

export interface PostParams {
  params: {
    domain: string
    operation: string
  }
}

export type PostBody = unknown

export const PostParamsSchema = z.object({
  params: z.object({
    domain: z.string(),
    operation: z.string()
  })
})

export const PostBodySchema = z.record(z.unknown())

export interface PostInput {
  params: PostParams
  body: PostBody
}

export const PostInputSchema = z.object({
  params: PostParamsSchema,
  body: z.unknown()
})

export type PostOutput = unknown
