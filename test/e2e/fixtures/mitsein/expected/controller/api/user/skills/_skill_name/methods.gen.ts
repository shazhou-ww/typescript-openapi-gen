// Auto-generated method wrappers with validation
// DO NOT EDIT - This file is regenerated on each run

import { z } from 'zod'

import { handleGet as _handleGet } from './get'
import { handleDelete as _handleDelete } from './delete'

import type { GetOutput, DeleteOutput } from './types.gen'

import { GetInputSchema, DeleteInputSchema } from './types.gen'

export async function handleGet(input: unknown): Promise<GetOutput> {
  const validatedInput = GetInputSchema.parse(input)
  return _handleGet(validatedInput)
}

export async function handleDelete(input: unknown): Promise<DeleteOutput> {
  const validatedInput = DeleteInputSchema.parse(input)
  return _handleDelete(validatedInput)
}
