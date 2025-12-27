// Auto-generated WorkflowVars type from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import { z } from 'zod'

export const WorkflowVarsSchema = z.object({
  id: z.string(),
  mapping: z.record(z.string()).optional()
})

export type WorkflowVars = z.infer<typeof WorkflowVarsSchema>
