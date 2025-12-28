// Auto-generated EventBatchRequest type from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import { z } from 'zod'

import { FrontendEventSchema } from './FrontendEvent.gen'

export const EventBatchRequestSchema = z.object({
  events: z.array(FrontendEventSchema).max(100),
})

export type EventBatchRequest = z.infer<typeof EventBatchRequestSchema>
