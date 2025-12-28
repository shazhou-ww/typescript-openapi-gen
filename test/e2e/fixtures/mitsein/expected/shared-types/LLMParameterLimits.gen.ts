// Auto-generated LLMParameterLimits type from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import { z } from 'zod'

export const LLMParameterLimitsSchema = z.object({
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
})

export type LLMParameterLimits = z.infer<typeof LLMParameterLimitsSchema>
