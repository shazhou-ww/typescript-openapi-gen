// Auto-generated HTTPValidationError type from OpenAPI specification
// DO NOT EDIT - This file is regenerated on each run

import { z } from 'zod'

import { ValidationErrorSchema } from './ValidationError.gen'

export const HTTPValidationErrorSchema = z.object({
  detail: z.array(ValidationErrorSchema).optional(),
})

export type HTTPValidationError = z.infer<typeof HTTPValidationErrorSchema>
