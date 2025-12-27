// Auto-generated UploadPhotoRequest type from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import { z } from 'zod'

export const UploadPhotoRequestSchema = z.object({
  url: z.string(),
  caption: z.string().optional(),
})

export type UploadPhotoRequest = z.infer<typeof UploadPhotoRequestSchema>
