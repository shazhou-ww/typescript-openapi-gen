// Auto-generated ToggleSkillRequest type from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import { z } from 'zod'

export const ToggleSkillRequestSchema = z.object({
  skill_name: z.string(),
  enabled: z.boolean(),
})

export type ToggleSkillRequest = z.infer<typeof ToggleSkillRequestSchema>
