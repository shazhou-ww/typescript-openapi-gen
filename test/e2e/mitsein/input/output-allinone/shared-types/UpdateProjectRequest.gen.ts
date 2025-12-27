// Auto-generated UpdateProjectRequest type from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import { z } from 'zod'

export const UpdateProjectRequestSchema = z.object({
  project_id: z.string().optional(),
  name: z.union([z.string(), z.unknown()]).optional(),
  description: z.union([z.string(), z.unknown()]).optional(),
  is_public: z.union([z.boolean(), z.unknown()]).optional(),
  access_token: z.string().optional(),
})

export type UpdateProjectRequest = z.infer<typeof UpdateProjectRequestSchema>
