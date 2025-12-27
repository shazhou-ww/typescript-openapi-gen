// Auto-generated FileListResponse type from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import { z } from 'zod'

export const FileListResponseSchema = z.object({
  files: z.array(z.record(z.unknown())).optional(),
  next_page_token: z.union([z.string(), z.unknown()]).optional(),
})

export type FileListResponse = z.infer<typeof FileListResponseSchema>
