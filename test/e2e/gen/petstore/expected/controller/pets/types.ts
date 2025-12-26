// Auto-generated types from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import type { Pet, CreatePetRequest } from '../../shared-types'

export interface GetInput {
  query: {
    limit?: number
    offset?: number
  }
}

export type GetOutput = Array<Pet>

export interface PostInput {
  body: CreatePetRequest
}

export type PostOutput = Pet
