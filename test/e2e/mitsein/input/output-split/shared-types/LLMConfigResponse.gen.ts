// Auto-generated LLMConfigResponse type from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import { z } from 'zod'

export const LLMConfigResponseSchema = z.object({
  limits: z.unknown(),
  models: z.array(z.unknown()),
  default_model: z.union([z.string(), z.unknown()]),
  env_mode: z.string(),
})

export type LLMConfigResponse = z.infer<typeof LLMConfigResponseSchema>
