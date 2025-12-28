// Auto-generated CreateTriggerApiRequest type from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import { z } from 'zod'

import { TriggerTypeSchema } from './TriggerType.gen'

export const CreateTriggerApiRequestSchema = z.object({
  name: z.string(),
  description: z.union([z.string(), z.unknown()]).optional(),
  trigger_type: TriggerTypeSchema,
  config: z.record(z.unknown()),
  is_active: z.boolean().optional(),
})

export type CreateTriggerApiRequest = z.infer<
  typeof CreateTriggerApiRequestSchema
>
