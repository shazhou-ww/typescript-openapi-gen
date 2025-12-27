// Auto-generated types from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import { z } from 'zod'

export type GetInput = {}
export const GetInputSchema = z.object({})

export type GetOutput = {
  limits: unknown
  models: Array<unknown>
  default_model: string | unknown
  env_mode: string
}
