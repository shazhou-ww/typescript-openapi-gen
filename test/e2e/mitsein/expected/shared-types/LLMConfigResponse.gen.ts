// Auto-generated LLMConfigResponse type from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import { z } from 'zod'

import { LLMParameterLimitsSchema } from './LLMParameterLimits.gen'
import { ModelInfoSchema } from './ModelInfo.gen'

export const LLMConfigResponseSchema = z.object({
  limits: LLMParameterLimitsSchema,
  models: z.array(ModelInfoSchema),
  default_model: z.union([z.string(), z.unknown()]),
  env_mode: z.string()
})

export type LLMConfigResponse = z.infer<typeof LLMConfigResponseSchema>
