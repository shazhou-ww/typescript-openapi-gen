// Auto-generated types from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import type { LogEntry, ValidationError } from '../../../../shared-types'
import { LogEntrySchema, ValidationErrorSchema } from '../../../../shared-types'

import { z } from 'zod'

export type PostBody = unknown

export const PostBodySchema = z.object({
  logs: z.array(LogEntrySchema),
})

export interface PostInput {
  body: PostBody
}

export const PostInputSchema = z.object({
  body: z.unknown(),
})

export type PostOutput = unknown
