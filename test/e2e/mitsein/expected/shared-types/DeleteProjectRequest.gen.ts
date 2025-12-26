// Auto-generated DeleteProjectRequest type from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import { z } from 'zod'

export const DeleteProjectRequestSchema = z.object({
  project_id: z.string().optional()
})

export type DeleteProjectRequest = z.infer<typeof DeleteProjectRequestSchema>
