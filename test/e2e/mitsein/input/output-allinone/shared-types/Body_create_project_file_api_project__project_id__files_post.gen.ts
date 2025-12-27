// Auto-generated Body_create_project_file_api_project__project_id__files_post type from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import { z } from 'zod'

export const Body_create_project_file_api_project__project_id__files_postSchema =
  z.object({
    path: z.string(),
    file: z.string(),
  })

export type Body_create_project_file_api_project__project_id__files_post =
  z.infer<
    typeof Body_create_project_file_api_project__project_id__files_postSchema
  >
