// Auto-generated OAuthInitiateResponse type from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import { z } from 'zod'

export const OAuthInitiateResponseSchema = z.object({
  authorization_url: z.string(),
  state: z.string(),
  connector_id: z.string(),
})

export type OAuthInitiateResponse = z.infer<typeof OAuthInitiateResponseSchema>
