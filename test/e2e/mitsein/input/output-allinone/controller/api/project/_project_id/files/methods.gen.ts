// Auto-generated method wrappers with validation
// DO NOT EDIT - This file is regenerated on each run

import { z } from 'zod'

import { handleGet as _handleGet } from './get'
import { handlePost as _handlePost } from './post'
import { handleDelete as _handleDelete } from './delete'

import type { GetOutput, PostOutput, DeleteOutput } from './types.gen'

import { GetInputSchema, PostInputSchema, DeleteInputSchema } from './types.gen'

export async function handleGet(input: unknown): Promise<GetOutput> {
  const validatedInput = GetInputSchema.parse(input)
  return _handleGet(validatedInput)
}

export async function handlePost(input: unknown): Promise<PostOutput> {
  const validatedInput = PostInputSchema.parse(input)
  return _handlePost(validatedInput)
}

export async function handleDelete(input: unknown): Promise<DeleteOutput> {
  const validatedInput = DeleteInputSchema.parse(input)
  return _handleDelete(validatedInput)
}
