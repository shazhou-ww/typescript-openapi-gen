// Auto-generated FrontendLogsRequest type from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import { z } from 'zod'

import { LogEntrySchema } from './LogEntry.gen'

export const FrontendLogsRequestSchema = z.object({
  logs: z.array(LogEntrySchema),
})

export type FrontendLogsRequest = z.infer<typeof FrontendLogsRequestSchema>
