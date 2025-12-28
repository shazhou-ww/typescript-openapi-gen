// Auto-generated CreateProjectRequest type from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import { z } from 'zod'

export const CreateProjectRequestSchema = z.object({
  project_name: z.string().optional(),
  project_description: z.union([z.string(), z.unknown()]).optional(),
})

export type CreateProjectRequest = z.infer<typeof CreateProjectRequestSchema>
