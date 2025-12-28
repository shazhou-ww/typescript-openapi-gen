// Auto-generated UpdateGdprConsentRequest type from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import { z } from 'zod'

export const UpdateGdprConsentRequestSchema = z.object({
  gdpr_consent: z.boolean(),
})

export type UpdateGdprConsentRequest = z.infer<
  typeof UpdateGdprConsentRequestSchema
>
