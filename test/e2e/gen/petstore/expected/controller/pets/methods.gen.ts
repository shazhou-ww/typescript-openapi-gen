// Auto-generated method wrappers with validation
// DO NOT EDIT - This file is regenerated on each run

import { z } from 'zod'

import { handleGet as _handleGet } from './get'
import { handlePost as _handlePost } from './post'

import type { GetInput, GetOutput, PostInput, PostOutput } from './types.gen'

import { GetInputSchema, PostInputSchema, PostBodySchema } from './types.gen'

export async function handleGet(input: GetInput): Promise<GetOutput> {
  const validatedInput = GetInputSchema.parse(input)
  return _handleGet(validatedInput)
}

export async function handlePost(input: PostInput): Promise<PostOutput> {
  const validatedInput = PostInputSchema.parse(input)
  const validatedBody = PostBodySchema.parse(input.body)
  const validated = { ...validatedInput, body: validatedBody }
  return _handlePost(validated as PostInput)
}
