// Auto-generated QuickStartResponse type from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import { z } from 'zod'

export const QuickStartResponseSchema = z.object({
  project_id: z.string(),
  thread_id: z.string(),
  message_id: z.string(),
  agent_run_id: z.string(),
  project: z.record(z.unknown()),
  thread: z.record(z.unknown()),
  performance_metrics: z.record(z.unknown()).optional(),
})

export type QuickStartResponse = z.infer<typeof QuickStartResponseSchema>
