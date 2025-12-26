// Auto-generated FrontendEvent type from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import { z } from 'zod'

export const FrontendEventSchema = z.object({
  id: z.string(),
  threadId: z.string(),
  agentRunId: z.string(),
  eventType: z.string(),
  eventName: z.union([z.string(), z.unknown()]).optional(),
  timestamp: z.string(),
  payload: z.union([z.record(z.unknown()), z.unknown()]).optional(),
  url: z.union([z.string(), z.unknown()]).optional(),
  success: z.union([z.boolean(), z.unknown()]).optional(),
  durationMs: z.union([z.number(), z.unknown()]).optional(),
  clientTimestamp: z.union([z.number().int(), z.unknown()]).optional(),
  messageId: z.union([z.string(), z.unknown()]).optional(),
  sequenceNumber: z.union([z.number().int(), z.unknown()]).optional()
})

export type FrontendEvent = z.infer<typeof FrontendEventSchema>
