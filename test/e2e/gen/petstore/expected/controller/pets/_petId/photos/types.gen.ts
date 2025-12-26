// Auto-generated types from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import type { Photo, UploadPhotoRequest } from '../../../../shared-types'
import { PhotoSchema, UploadPhotoRequestSchema } from '../../../../shared-types'

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

export type GetOutput = Array<Photo>

export interface PostParams {
  params: {
    petId: string
  }
}

export type PostBody = unknown

export const PostParamsSchema = z.object({
  params: z.object({
    petId: z.string(),
  }),
})

export const PostBodySchema = UploadPhotoRequestSchema

export interface PostInput {
  params: PostParams
  body: PostBody
}

export const PostInputSchema = z.object({
  params: PostParamsSchema,
  body: z.unknown(),
})

export type PostOutput = Photo
