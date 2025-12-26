// Auto-generated FileUploadRequest type from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import { z } from 'zod'

export const FileUploadRequestSchema = z.object({
  name: z.string(),
  content: z.string(),
  mimeType: z.string(),
  folder_id: z.union([z.string(), z.unknown()]).optional()
})

export type FileUploadRequest = z.infer<typeof FileUploadRequestSchema>
