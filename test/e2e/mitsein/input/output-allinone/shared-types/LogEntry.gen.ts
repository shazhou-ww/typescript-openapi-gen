// Auto-generated LogEntry type from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import { z } from 'zod'

export const LogEntrySchema = z.object({
  timestamp: z.string(),
  level: z.string(),
  message: z.string(),
  data: z.record(z.unknown()),
})

export type LogEntry = z.infer<typeof LogEntrySchema>
