// Auto-generated method wrappers with validation
// DO NOT EDIT - This file is regenerated on each run

import { z } from 'zod'

import { handleGet as _handleGet } from './get'
import { handleHead as _handleHead } from './head'

import type {
  GetOutput,
  HeadOutput
} from './types.gen'

import {
  GetInputSchema,
  HeadInputSchema
} from './types.gen'

export async function handleGet(input: unknown): Promise<GetOutput> {
  const validatedInput = GetInputSchema.parse(input)
  return _handleGet(validatedInput)
}

export async function handleHead(input: unknown): Promise<HeadOutput> {
  const validatedInput = HeadInputSchema.parse(input)
  return _handleHead(validatedInput)
}
