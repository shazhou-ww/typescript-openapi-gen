// Auto-generated types from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import type { Photo, UploadPhotoRequest } from '../../../../shared-types'
import { PhotoSchema, UploadPhotoRequestSchema } from '../../../../shared-types'

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

export type GetOutput = Array<Photo>

export interface PostInput {
  params: {
    petId: string
  }
  body: unknown
}

export const PostInputSchema = z.object({
  params: z.object({
    petId: z.string(),
  }),
  body: z.unknown(),
})

export const PostBodySchema = UploadPhotoRequestSchema

export type PostOutput = Photo
