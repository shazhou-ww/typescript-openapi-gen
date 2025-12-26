// Auto-generated FileUploadResponse type from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import { z } from 'zod'

export const FileUploadResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  mimeType: z.string(),
  webViewLink: z.union([z.string(), z.unknown()]).optional()
})

export type FileUploadResponse = z.infer<typeof FileUploadResponseSchema>
