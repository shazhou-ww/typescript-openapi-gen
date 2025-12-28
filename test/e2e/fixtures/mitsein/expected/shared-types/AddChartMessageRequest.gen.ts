// Auto-generated AddChartMessageRequest type from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import { z } from 'zod'

export const AddChartMessageRequestSchema = z.object({
  thread_id: z.string().optional(),
  type: z.string().optional(),
  is_llm_message: z.boolean().optional(),
  chart_type: z.string().optional(),
  format_type: z.string().optional(),
})

export type AddChartMessageRequest = z.infer<
  typeof AddChartMessageRequestSchema
>
