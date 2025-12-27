// Auto-generated types from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import type { ModelInfo } from '../../../../../shared-types'
import { ModelInfoSchema } from '../../../../../shared-types'

import { z } from 'zod'

export type GetInput = {}
export const GetInputSchema = z.object({})

export type GetOutput = {
  limits: {
    temperature_min?: number
    temperature_max?: number
    temperature_default?: number
    max_tokens_min?: number
    max_tokens_max?: number
    max_tokens_default?: number
    reasoning_efforts?: Array<string>
    reasoning_effort_default?: string
    enable_context_manager_default?: boolean
    enable_thinking_default?: boolean
    max_iterations_min?: number
    max_iterations_max?: number
    max_iterations_default?: number
  }
  models: Array<ModelInfo>
  default_model: string | unknown
  env_mode: string
}
