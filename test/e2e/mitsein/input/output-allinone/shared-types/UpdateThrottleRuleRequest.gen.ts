// Auto-generated UpdateThrottleRuleRequest type from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import { z } from 'zod'

export const UpdateThrottleRuleRequestSchema = z.object({
  user_id: z.string(),
  throttle_rule: z.record(z.unknown()),
})

export type UpdateThrottleRuleRequest = z.infer<
  typeof UpdateThrottleRuleRequestSchema
>
