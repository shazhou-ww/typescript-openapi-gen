// Auto-generated ProjectIdRequest type from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import { z } from 'zod'

export const ProjectIdRequestSchema = z.object({
  project_id: z.string(),
})

export type ProjectIdRequest = z.infer<typeof ProjectIdRequestSchema>
