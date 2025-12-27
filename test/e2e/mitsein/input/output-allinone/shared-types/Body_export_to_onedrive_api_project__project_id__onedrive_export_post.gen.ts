// Auto-generated Body_export_to_onedrive_api_project__project_id__onedrive_export_post type from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import { z } from 'zod'

export const Body_export_to_onedrive_api_project__project_id__onedrive_export_postSchema =
  z.object({
    file_content: z.string(),
    filename: z.string(),
  })

export type Body_export_to_onedrive_api_project__project_id__onedrive_export_post =
  z.infer<
    typeof Body_export_to_onedrive_api_project__project_id__onedrive_export_postSchema
  >
