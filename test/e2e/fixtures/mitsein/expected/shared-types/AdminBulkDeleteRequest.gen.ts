// Auto-generated AdminBulkDeleteRequest type from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import { z } from 'zod'

export const AdminBulkDeleteRequestSchema = z.object({
  project_ids: z.array(z.string())
})

export type AdminBulkDeleteRequest = z.infer<typeof AdminBulkDeleteRequestSchema>
