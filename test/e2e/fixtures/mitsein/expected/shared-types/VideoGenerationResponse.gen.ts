// Auto-generated VideoGenerationResponse type from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import { z } from 'zod'

export const VideoGenerationResponseSchema = z.object({
  success: z.boolean(),
  video_id: z.union([z.string(), z.unknown()]).optional(),
  video_url: z.union([z.string(), z.unknown()]).optional(),
  thumbnail_url: z.union([z.string(), z.unknown()]).optional(),
  duration: z.union([z.number(), z.unknown()]).optional(),
  status: z.string(),
  error: z.union([z.string(), z.unknown()]).optional(),
  message: z.string(),
})

export type VideoGenerationResponse = z.infer<
  typeof VideoGenerationResponseSchema
>
