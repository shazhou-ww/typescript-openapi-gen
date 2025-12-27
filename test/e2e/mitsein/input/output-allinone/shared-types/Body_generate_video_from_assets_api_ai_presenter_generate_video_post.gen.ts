// Auto-generated Body_generate_video_from_assets_api_ai_presenter_generate_video_post type from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import { z } from 'zod'

export const Body_generate_video_from_assets_api_ai_presenter_generate_video_postSchema =
  z.object({
    video_title: z.union([z.string(), z.unknown()]).optional(),
    image_file: z.string(),
    audio_file: z.string(),
  })

export type Body_generate_video_from_assets_api_ai_presenter_generate_video_post =
  z.infer<
    typeof Body_generate_video_from_assets_api_ai_presenter_generate_video_postSchema
  >
