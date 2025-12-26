// Auto-generated DocumentReadResponse type from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import { z } from 'zod'

export const DocumentReadResponseSchema = z.object({
  document_id: z.string(),
  title: z.string(),
  content: z.string(),
  metadata: z.record(z.unknown()).optional()
})

export type DocumentReadResponse = z.infer<typeof DocumentReadResponseSchema>
