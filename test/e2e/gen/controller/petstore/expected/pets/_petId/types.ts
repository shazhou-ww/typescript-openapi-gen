// Auto-generated types from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import type { Pet, UpdatePetRequest } from '../../types/index.js'

export interface GetInput {
  params: {
    petId: string
  }
}

export type GetOutput = Pet

export interface PutInput {
  params: {
    petId: string
  }
  body: UpdatePetRequest
}

export type PutOutput = Pet

export interface DeleteInput {
  params: {
    petId: string
  }
}

export type DeleteOutput = void
