// Auto-generated OAuthInitiateRequest type from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import { z } from 'zod'

export const OAuthInitiateRequestSchema = z.object({
  redirect_uri: z.string(),
  scopes: z.union([z.array(z.string()), z.unknown()]).optional(),
  account_label: z.union([z.string(), z.unknown()]).optional()
})

export type OAuthInitiateRequest = z.infer<typeof OAuthInitiateRequestSchema>
