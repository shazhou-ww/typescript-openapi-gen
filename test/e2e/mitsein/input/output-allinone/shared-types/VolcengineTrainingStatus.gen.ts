// Auto-generated VolcengineTrainingStatus type from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import { z } from 'zod'

export const VolcengineTrainingStatusSchema = z.object({
  speaker_id: z.string(),
  instance_no: z.string(),
  is_activatable: z.boolean(),
  state: z.string(),
  demo_audio: z.union([z.string(), z.unknown()]).optional(),
  version: z.union([z.string(), z.unknown()]).optional(),
  create_time: z.number().int(),
  expire_time: z.number().int(),
  order_time: z.number().int(),
  alias: z.string(),
  available_training_times: z.number().int(),
  resource_id: z.string(),
})

export type VolcengineTrainingStatus = z.infer<
  typeof VolcengineTrainingStatusSchema
>
