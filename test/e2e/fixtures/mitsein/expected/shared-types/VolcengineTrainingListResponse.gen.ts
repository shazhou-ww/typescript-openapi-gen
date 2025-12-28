// Auto-generated VolcengineTrainingListResponse type from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import { z } from 'zod'

import { VolcengineTrainingStatusSchema } from './VolcengineTrainingStatus.gen'

export const VolcengineTrainingListResponseSchema = z.object({
  success: z.boolean(),
  error: z.union([z.string(), z.unknown()]).optional(),
  data: z.array(VolcengineTrainingStatusSchema).optional(),
})

export type VolcengineTrainingListResponse = z.infer<
  typeof VolcengineTrainingListResponseSchema
>
