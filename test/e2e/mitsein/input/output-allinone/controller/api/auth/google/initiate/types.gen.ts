// Auto-generated types from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import { z } from 'zod'

export type PostInput = {}
export const PostInputSchema = z.object({})

export type PostOutput = {
  authorization_url: string
  state: string
}
