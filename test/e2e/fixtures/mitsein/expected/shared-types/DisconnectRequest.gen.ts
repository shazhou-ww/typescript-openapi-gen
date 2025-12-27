// Auto-generated DisconnectRequest type from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import { z } from 'zod'

export const DisconnectRequestSchema = z.object({
  authorization_id: z.string()
})

export type DisconnectRequest = z.infer<typeof DisconnectRequestSchema>
