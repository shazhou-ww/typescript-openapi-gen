// Auto-generated types from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import type { Photo, UploadPhotoRequest } from '../../../../shared-types'

export interface GetInput {
  params: {
    petId: string
  }
}

export type GetOutput = Array<Photo>

export interface PostInput {
  params: {
    petId: string
  }
  body: UploadPhotoRequest
}

export type PostOutput = Photo
