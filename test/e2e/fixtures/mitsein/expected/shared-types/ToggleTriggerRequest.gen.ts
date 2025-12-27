// Auto-generated ToggleTriggerRequest type from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import { z } from 'zod'

export const ToggleTriggerRequestSchema = z.object({
  is_active: z.boolean()
})

export type ToggleTriggerRequest = z.infer<typeof ToggleTriggerRequestSchema>
