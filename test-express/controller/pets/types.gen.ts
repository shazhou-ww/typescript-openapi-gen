// Auto-generated types from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import type { Pet, CreatePetRequest } from '../../shared-types'
import { PetSchema, CreatePetRequestSchema } from '../../shared-types'

import { z } from 'zod'

export interface GetQuery {
  limit?: number
  offset?: number
}

export const GetQuerySchema = z.object({
  limit: z.number().int().max(100).optional(),
  offset: z.number().int().optional(),
})

export interface GetInput {
  query: GetQuery
}

export const GetInputSchema = z.object({
  query: GetQuerySchema,
})

export type GetOutput = Array<Pet>

export type PostBody = unknown

export const PostBodySchema = CreatePetRequestSchema

export interface PostInput {
  body: PostBody
}

export const PostInputSchema = z.object({
  body: z.unknown(),
})

export type PostOutput = Pet
