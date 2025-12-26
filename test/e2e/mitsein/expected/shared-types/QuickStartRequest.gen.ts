// Auto-generated QuickStartRequest type from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import { z } from 'zod'

import { WorkflowVarsSchema } from './WorkflowVars.gen'

export const QuickStartRequestSchema = z.object({
  prompt: z.string(),
  files: z.array(z.record(z.unknown())).optional(),
  metadata: z.record(z.unknown()).optional(),
  project_name: z.union([z.string(), z.unknown()]).optional(),
  project_description: z.union([z.string(), z.unknown()]).optional(),
  workflow_vars: z.union([WorkflowVarsSchema, z.unknown()]).optional()
})

export type QuickStartRequest = z.infer<typeof QuickStartRequestSchema>
