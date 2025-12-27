// Auto-generated BulkDeleteRequest type from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import { z } from 'zod'

export const BulkDeleteRequestSchema = z.object({
  project_ids: z.array(z.string()).optional(),
})

export type BulkDeleteRequest = z.infer<typeof BulkDeleteRequestSchema>
