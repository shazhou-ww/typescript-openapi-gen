// Auto-generated OAuthCallbackResponse type from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import { z } from 'zod'

export const OAuthCallbackResponseSchema = z.object({
  authorization_id: z.string(),
  connector_id: z.string(),
  scopes: z.array(z.string()),
  expires_at: z.string()
})

export type OAuthCallbackResponse = z.infer<typeof OAuthCallbackResponseSchema>
