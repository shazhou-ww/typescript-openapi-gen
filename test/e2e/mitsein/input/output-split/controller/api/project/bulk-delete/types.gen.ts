// Auto-generated types from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import type { ValidationError.yaml } from '../../../../shared-types'
import { ValidationError.yamlSchema } from '../../../../shared-types'


import { z } from 'zod'

export type PostBody = unknown

export const PostBodySchema = z.object({
  project_ids: z.array(z.string()).optional()
})

export interface PostInput {
  body: PostBody
}

export const PostInputSchema = z.object({
  body: z.unknown()
})

export type PostOutput = unknown
