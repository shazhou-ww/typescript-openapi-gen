// Auto-generated BatchDownloadRequest type from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import { z } from 'zod'

export const BatchDownloadRequestSchema = z.object({
  file_paths: z.array(z.string()),
})

export type BatchDownloadRequest = z.infer<typeof BatchDownloadRequestSchema>
