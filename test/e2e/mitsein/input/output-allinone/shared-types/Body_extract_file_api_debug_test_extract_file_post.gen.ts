// Auto-generated Body_extract_file_api_debug_test_extract_file_post type from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import { z } from 'zod'

export const Body_extract_file_api_debug_test_extract_file_postSchema =
  z.object({
    file: z.string(),
  })

export type Body_extract_file_api_debug_test_extract_file_post = z.infer<
  typeof Body_extract_file_api_debug_test_extract_file_postSchema
>
