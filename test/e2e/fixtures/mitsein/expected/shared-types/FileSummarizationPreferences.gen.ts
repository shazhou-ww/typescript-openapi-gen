// Auto-generated FileSummarizationPreferences type from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import { z } from 'zod'

export const FileSummarizationPreferencesSchema = z.object({
  enable_smart_summarization: z.boolean().optional()
})

export type FileSummarizationPreferences = z.infer<typeof FileSummarizationPreferencesSchema>
