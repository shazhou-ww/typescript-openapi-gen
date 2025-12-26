// Auto-generated method wrappers with validation
// DO NOT EDIT - This file is regenerated on each run

import { z } from 'zod'

import { handleGet as _handleGet } from './get'
import { handlePut as _handlePut } from './put'
import { handleDelete as _handleDelete } from './delete'

import type { GetOutput, PutOutput, DeleteOutput } from './types.gen'

import {
  GetInputSchema,
  PutInputSchema,
  PutBodySchema,
  DeleteInputSchema,
} from './types.gen'

export async function handleGet(input: unknown): Promise<GetOutput> {
  const validatedInput = GetInputSchema.parse(input)
  return _handleGet(validatedInput)
}

export async function handlePut(input: unknown): Promise<PutOutput> {
  const validatedInput = PutInputSchema.parse(input)
  const inputObj = input as any
  const validatedBody = PutBodySchema.parse(inputObj.body)
  const validated = { ...validatedInput, body: validatedBody }
  return _handlePut(validated)
}

export async function handleDelete(input: unknown): Promise<DeleteOutput> {
  const validatedInput = DeleteInputSchema.parse(input)
  return _handleDelete(validatedInput)
}
