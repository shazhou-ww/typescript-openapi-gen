// Auto-generated types from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import type { Pet, UpdatePetRequest } from '../../../shared-types'
import { PetSchema, UpdatePetRequestSchema } from '../../../shared-types'

import { z } from 'zod'

export interface GetInput {
  params: {
    petId: string
  }
}

export const GetInputSchema = z.object({
  params: z.object({
    petId: z.string(),
  }),
})

export type GetOutput = Pet

export interface PutInput {
  params: {
    petId: string
  }
  body: unknown
}

export const PutInputSchema = z.object({
  params: z.object({
    petId: z.string(),
  }),
  body: z.unknown(),
})

export const PutBodySchema = UpdatePetRequestSchema

export type PutOutput = Pet

export interface DeleteInput {
  params: {
    petId: string
  }
}

export const DeleteInputSchema = z.object({
  params: z.object({
    petId: z.string(),
  }),
})

export type DeleteOutput = void
