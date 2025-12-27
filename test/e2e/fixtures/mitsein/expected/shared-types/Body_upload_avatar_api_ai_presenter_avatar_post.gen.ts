// Auto-generated Body_upload_avatar_api_ai_presenter_avatar_post type from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import { z } from 'zod'

export const Body_upload_avatar_api_ai_presenter_avatar_postSchema = z.object({
  project_id: z.string(),
  speaker_id: z.string(),
  avatar_file: z.string()
})

export type Body_upload_avatar_api_ai_presenter_avatar_post = z.infer<typeof Body_upload_avatar_api_ai_presenter_avatar_postSchema>
