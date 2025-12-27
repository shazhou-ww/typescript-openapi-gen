// Auto-generated AddThemeMessageRequest type from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import { z } from 'zod'

export const AddThemeMessageRequestSchema = z.object({
  thread_id: z.string().optional(),
  type: z.string().optional(),
  is_llm_message: z.boolean().optional(),
  theme_name: z.string().optional(),
  format_type: z.string().optional(),
})

export type AddThemeMessageRequest = z.infer<
  typeof AddThemeMessageRequestSchema
>
