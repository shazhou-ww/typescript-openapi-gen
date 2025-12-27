// Auto-generated TriggerType type from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import { z } from 'zod'

export const TriggerTypeSchema = z.enum(['schedule', 'teams'])

export type TriggerType = z.infer<typeof TriggerTypeSchema>
