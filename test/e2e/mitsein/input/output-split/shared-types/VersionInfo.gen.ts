// Auto-generated VersionInfo type from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import { z } from 'zod'

export const VersionInfoSchema = z.object({
  commit_hash: z.string(),
  branch_name: z.string(),
  build_time: z.string(),
})

export type VersionInfo = z.infer<typeof VersionInfoSchema>
