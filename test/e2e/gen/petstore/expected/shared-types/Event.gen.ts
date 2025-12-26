// Auto-generated Event type from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import { z } from 'zod'

export const EventSchema = z.object({
  type: z.string(),
  data: z.object({}),
  timestamp: z.string().optional(),
})

export type Event = z.infer<typeof EventSchema>
