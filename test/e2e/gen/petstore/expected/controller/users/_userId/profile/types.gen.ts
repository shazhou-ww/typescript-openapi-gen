// Auto-generated types from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import type { UserProfile } from '../../../../shared-types'
import { UserProfileSchema } from '../../../../shared-types'

import { z } from 'zod'

export interface GetInput {
  params: {
    userId: string
  }
}

export const GetInputSchema = z.object({
  params: z.object({
    userId: z.string(),
  }),
})

export type GetOutput = UserProfile
