// Auto-generated ExecuteWriteRequest type from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import { z } from 'zod'

export const ExecuteWriteRequestSchema = z.object({
  approval_id: z.string(),
})

export type ExecuteWriteRequest = z.infer<typeof ExecuteWriteRequestSchema>
