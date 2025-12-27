// Auto-generated types from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import type { VolcengineTrainingStatus } from '../../../../shared-types'
import { VolcengineTrainingStatusSchema } from '../../../../shared-types'

import { z } from 'zod'

export type GetInput = {}
export const GetInputSchema = z.object({})

export type GetOutput = {
  success: boolean
  error?: string | unknown
  data?: Array<VolcengineTrainingStatus>
}
