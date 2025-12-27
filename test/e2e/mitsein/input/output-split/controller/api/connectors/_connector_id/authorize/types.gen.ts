// Auto-generated types from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import type { ValidationError.yaml } from '../../../../../shared-types'
import { ValidationError.yamlSchema } from '../../../../../shared-types'


import { z } from 'zod'

export interface PostParams {
  params: {
    connector_id: string
  }
}

export const PostParamsSchema = z.object({
  params: z.object({
    connector_id: z.string()
  })
})

export interface PostInput {
  params: PostParams
}

export const PostInputSchema = z.object({
  params: PostParamsSchema
})

export type PostOutput = void
