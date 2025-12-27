// Auto-generated LLMConfigResponse type from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import { z } from 'zod'

import { ModelInfoSchema } from './ModelInfo.gen'

export const LLMConfigResponseSchema = z.object({
  limits: z.object({
    temperature_min: z.number().optional(),
    temperature_max: z.number().optional(),
    temperature_default: z.number().optional(),
    max_tokens_min: z.number().int().optional(),
    max_tokens_max: z.number().int().optional(),
    max_tokens_default: z.number().int().optional(),
    reasoning_efforts: z.array(z.string()).optional(),
    reasoning_effort_default: z.string().optional(),
    enable_context_manager_default: z.boolean().optional(),
    enable_thinking_default: z.boolean().optional(),
    max_iterations_min: z.number().int().optional(),
    max_iterations_max: z.number().int().optional(),
    max_iterations_default: z.number().int().optional(),
  }),
  models: z.array(ModelInfoSchema),
  default_model: z.union([z.string(), z.unknown()]),
  env_mode: z.string(),
})

export type LLMConfigResponse = z.infer<typeof LLMConfigResponseSchema>
