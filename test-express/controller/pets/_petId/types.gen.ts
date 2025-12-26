// Auto-generated types from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import type { Pet, UpdatePetRequest } from '../../../shared-types'
import { PetSchema, UpdatePetRequestSchema } from '../../../shared-types'

import { z } from 'zod'

export interface GetParams {
  params: {
    petId: string
  }
}

export const GetParamsSchema = z.object({
  params: z.object({
    petId: z.string(),
  }),
})

export interface GetInput {
  params: GetParams
}

export const GetInputSchema = z.object({
  params: GetParamsSchema,
})

export type GetOutput = Pet

export interface PutParams {
  params: {
    petId: string
  }
}

export type PutBody = unknown

export const PutParamsSchema = z.object({
  params: z.object({
    petId: z.string(),
  }),
})

export const PutBodySchema = UpdatePetRequestSchema

export interface PutInput {
  params: PutParams
  body: PutBody
}

export const PutInputSchema = z.object({
  params: PutParamsSchema,
  body: z.unknown(),
})

export type PutOutput = Pet

export interface DeleteParams {
  params: {
    petId: string
  }
}

export const DeleteParamsSchema = z.object({
  params: z.object({
    petId: z.string(),
  }),
})

export interface DeleteInput {
  params: DeleteParams
}

export const DeleteInputSchema = z.object({
  params: DeleteParamsSchema,
})

export type DeleteOutput = void
