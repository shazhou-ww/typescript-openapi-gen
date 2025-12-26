// Auto-generated Body_upload_project_file_api_projects__project_id__files_upload_post type from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import { z } from 'zod'

export const Body_upload_project_file_api_projects__project_id__files_upload_postSchema = z.object({
  file: z.string(),
  file_path: z.string(),
  thread_id: z.string().optional()
})

export type Body_upload_project_file_api_projects__project_id__files_upload_post = z.infer<typeof Body_upload_project_file_api_projects__project_id__files_upload_postSchema>
