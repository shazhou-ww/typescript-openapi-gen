// Auto-generated types from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import type { Pet, CreatePetRequest } from '../../shared-types'
import { PetSchema, CreatePetRequestSchema } from '../../shared-types'

import { z } from 'zod'

export interface GetInput {
  query: {
    limit?: number
    offset?: number
  }
}

export const GetInputSchema = z.object({
  query: z.object({
    limit: z.number().int().max(100).optional(),
    offset: z.number().int().optional(),
  }),
})

export type GetOutput = Array<Pet>

export interface PostInput {
  body: unknown
}

export const PostInputSchema = z.object({
  body: z.unknown(),
})

export const PostBodySchema = CreatePetRequestSchema

export type PostOutput = Pet
