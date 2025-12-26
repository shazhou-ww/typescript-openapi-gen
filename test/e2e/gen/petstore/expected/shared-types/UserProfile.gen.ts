// Auto-generated UserProfile type from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import { z } from 'zod'

export const UserProfileSchema = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string().optional(),
  avatar: z.string().optional(),
})

export type UserProfile = z.infer<typeof UserProfileSchema>
