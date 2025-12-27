// Auto-generated TTSRequest type from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import { z } from 'zod'

export const TTSRequestSchema = z.object({
  speaker_id: z.string(),
  script_text: z.string(),
  slide_filename: z.string(),
  project_id: z.string(),
  language: z.union([z.string(), z.unknown()]).optional(),
})

export type TTSRequest = z.infer<typeof TTSRequestSchema>
