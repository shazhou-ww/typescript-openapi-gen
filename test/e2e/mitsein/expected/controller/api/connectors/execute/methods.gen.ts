// Auto-generated method wrappers with validation
// DO NOT EDIT - This file is regenerated on each run

import { z } from 'zod'

import { handlePost as _handlePost } from './post'

import type {
  PostOutput
} from './types.gen'

import {
  PostInputSchema,
  PostBodySchema
} from './types.gen'

export async function handlePost(input: unknown): Promise<PostOutput> {
  const validatedInput = PostInputSchema.parse(input)
  const inputObj = input as any
  const validatedBody = PostBodySchema.parse(inputObj.body)
  const validated = { ...validatedInput, body: validatedBody }
  return _handlePost(validated)
}
