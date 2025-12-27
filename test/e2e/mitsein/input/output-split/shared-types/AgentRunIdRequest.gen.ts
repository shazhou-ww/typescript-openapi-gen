// Auto-generated AgentRunIdRequest type from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import { z } from 'zod'

export const AgentRunIdRequestSchema = z.object({
  agent_run_id: z.string(),
})

export type AgentRunIdRequest = z.infer<typeof AgentRunIdRequestSchema>
