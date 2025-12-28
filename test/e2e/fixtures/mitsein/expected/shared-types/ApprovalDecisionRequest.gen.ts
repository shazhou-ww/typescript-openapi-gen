// Auto-generated ApprovalDecisionRequest type from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import { z } from 'zod'

export const ApprovalDecisionRequestSchema = z.object({
  approval_id: z.string(),
  decision: z.string(),
  modified_content: z.union([z.record(z.unknown()), z.unknown()]).optional(),
})

export type ApprovalDecisionRequest = z.infer<
  typeof ApprovalDecisionRequestSchema
>
