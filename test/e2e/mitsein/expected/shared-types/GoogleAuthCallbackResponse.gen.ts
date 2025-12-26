// Auto-generated GoogleAuthCallbackResponse type from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import { z } from 'zod'

export const GoogleAuthCallbackResponseSchema = z.object({
  success: z.boolean(),
  user_info: z.union([z.record(z.unknown()), z.unknown()]).optional(),
  access_token: z.union([z.string(), z.unknown()]).optional(),
  id_token: z.union([z.string(), z.unknown()]).optional(),
  expires_in: z.union([z.number().int(), z.unknown()]).optional(),
  error: z.union([z.string(), z.unknown()]).optional()
})

export type GoogleAuthCallbackResponse = z.infer<typeof GoogleAuthCallbackResponseSchema>
