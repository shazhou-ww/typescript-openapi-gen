// Auto-generated GetProjectRequest type from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import { z } from 'zod'

export const GetProjectRequestSchema = z.object({
  project_id: z.string().optional(),
})

export type GetProjectRequest = z.infer<typeof GetProjectRequestSchema>
