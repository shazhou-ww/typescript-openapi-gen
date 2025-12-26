// Auto-generated GoogleAuthInitiateResponse type from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import { z } from 'zod'

export const GoogleAuthInitiateResponseSchema = z.object({
  authorization_url: z.string(),
  state: z.string()
})

export type GoogleAuthInitiateResponse = z.infer<typeof GoogleAuthInitiateResponseSchema>
