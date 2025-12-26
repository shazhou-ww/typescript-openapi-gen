// Auto-generated method wrappers with validation
// DO NOT EDIT - This file is regenerated on each run

import { z } from 'zod'

import { handleGet as _handleGet } from './get'

import type {
  GetOutput
} from './types.gen'

import {
  GetInputSchema
} from './types.gen'

export async function handleGet(input: unknown): Promise<GetOutput> {
  const validatedInput = GetInputSchema.parse(input)
  return _handleGet(validatedInput)
}
