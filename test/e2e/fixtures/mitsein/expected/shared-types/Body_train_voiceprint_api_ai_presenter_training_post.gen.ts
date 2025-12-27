// Auto-generated Body_train_voiceprint_api_ai_presenter_training_post type from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import { z } from 'zod'

export const Body_train_voiceprint_api_ai_presenter_training_postSchema = z.object({
  speaker_id: z.string(),
  audio_file: z.string(),
  language: z.number().int().optional(),
  text: z.union([z.string(), z.unknown()]).optional()
})

export type Body_train_voiceprint_api_ai_presenter_training_post = z.infer<typeof Body_train_voiceprint_api_ai_presenter_training_postSchema>
