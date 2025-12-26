// Auto-generated UpdateTriggerRequest type from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import { z } from 'zod'

export const UpdateTriggerRequestSchema = z.object({
  name: z.union([z.string(), z.unknown()]).optional(),
  description: z.union([z.string(), z.unknown()]).optional(),
  config: z.union([z.record(z.unknown()), z.unknown()]).optional(),
  is_active: z.union([z.boolean(), z.unknown()]).optional()
})

export type UpdateTriggerRequest = z.infer<typeof UpdateTriggerRequestSchema>
