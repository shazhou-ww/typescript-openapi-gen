// Auto-generated types from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import type {
  FileListResponse,
  FileUploadRequest,
  FileUploadResponse,
  HTTPValidationError,
} from '../../../../../shared-types'
import {
  FileListResponseSchema,
  FileUploadRequestSchema,
  FileUploadResponseSchema,
  HTTPValidationErrorSchema,
} from '../../../../../shared-types'

import { z } from 'zod'

export interface GetParams {
  params: {
    connector_id: string
  }
}

export interface GetQuery {
  folder_id?: string | unknown
  page_size?: number
  page_token?: string | unknown
}

export const GetParamsSchema = z.object({
  params: z.object({
    connector_id: z.string()
  })
})

export const GetQuerySchema = z.object({
    folder_id: z.union([z.string(), z.unknown()]).optional(),
    page_size: z.number().int().min(1).max(1000).optional(),
    page_token: z.union([z.string(), z.unknown()]).optional()
})

export interface GetInput {
  params: GetParams
  query: GetQuery
}

export const GetInputSchema = z.object({
  params: GetParamsSchema,
  query: GetQuerySchema
})

export type GetOutput = FileListResponse

export interface PostParams {
  params: {
    connector_id: string
  }
}

export type PostBody = unknown

export const PostParamsSchema = z.object({
  params: z.object({
    connector_id: z.string()
  })
})

export const PostBodySchema = FileUploadRequestSchema

export interface PostInput {
  params: PostParams
  body: PostBody
}

export const PostInputSchema = z.object({
  params: PostParamsSchema,
  body: z.unknown()
})

export type PostOutput = FileUploadResponse
