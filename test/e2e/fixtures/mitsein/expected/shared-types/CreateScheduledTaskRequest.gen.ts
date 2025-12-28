// Auto-generated CreateScheduledTaskRequest type from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import { z } from 'zod'

export const CreateScheduledTaskRequestSchema = z.object({
  prompt: z.string(),
})

export type CreateScheduledTaskRequest = z.infer<
  typeof CreateScheduledTaskRequestSchema
>
