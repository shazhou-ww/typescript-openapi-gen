// Auto-generated types from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import type { WorkflowVars, ValidationError } from '../../../../shared-types'
import {
  WorkflowVarsSchema,
  ValidationErrorSchema,
} from '../../../../shared-types'

import { z } from 'zod'

export type PostBody = unknown

export const PostBodySchema = z.object({
  prompt: z.string(),
  files: z.array(z.record(z.unknown())).optional(),
  metadata: z.record(z.unknown()).optional(),
  project_name: z.union([z.string(), z.unknown()]).optional(),
  project_description: z.union([z.string(), z.unknown()]).optional(),
  workflow_vars: z.union([WorkflowVarsSchema, z.unknown()]).optional(),
})

export interface PostInput {
  body: PostBody
}

export const PostInputSchema = z.object({
  body: z.unknown(),
})

export type PostOutput = {
  project_id: string
  thread_id: string
  message_id: string
  agent_run_id: string
  project: Record<string, unknown>
  thread: Record<string, unknown>
  performance_metrics?: Record<string, unknown>
}
