import type { Context } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { ZodError, z } from 'zod'
import { SchemaError } from './schema-error'

export const ErrorCodeEnum = z.enum([
  'BAD_REQUEST',
  'FORBIDDEN',
  'INTERNAL_SERVER_ERROR',
  'USAGE_EXCEEDED',
  'DISABLED',
  'CONFLICT',
  'NOT_FOUND',
  'NOT_UNIQUE',
  'UNAUTHORIZED',
  'METHOD_NOT_ALLOWED',
  'UNPROCESSABLE_ENTITY',
])

export type ErrorCode = z.infer<typeof ErrorCodeEnum>

export function statusToCode(status: number): ErrorCode {
  switch (status) {
    case 400:
      return 'BAD_REQUEST'
    case 401:
      return 'UNAUTHORIZED'
    case 403:
      return 'FORBIDDEN'
    case 404:
      return 'NOT_FOUND'
    case 405:
      return 'METHOD_NOT_ALLOWED'
    case 409:
      return 'METHOD_NOT_ALLOWED'
    case 422:
      return 'UNPROCESSABLE_ENTITY'
    case 500:
      return 'INTERNAL_SERVER_ERROR'
    default:
      return 'INTERNAL_SERVER_ERROR'
  }
}

export type ErrorSchema = z.infer<ReturnType<typeof createErrorSchema>>

export function createErrorSchema(code: ErrorCode) {
  return z.object({
    code: ErrorCodeEnum.openapi({
      example: code,
      description: 'The error code related to the status code.',
    }),
    message: z.string().openapi({
      description: 'A human readable message describing the issue.',
      example: "Missing required field 'name'.",
    }),
    docs: z.string().openapi({
      description: 'A link to the documentation for the error.',
      example: `https://docs.openstatus.dev/api-references/errors/code/${code}`,
    }),
  })
}

export function handleError(err: Error, c: Context): Response {
  if (err instanceof ZodError) {
    const error = SchemaError.fromZod(err, c)
    return c.json<ErrorSchema>(
      {
        code: 'BAD_REQUEST',
        message: error.message,
        docs: 'https://docs.openstatus.dev/api-references/errors/code/BAD_REQUEST',
      },
      { status: 400 },
    )
  }
  if (err instanceof HTTPException) {
    const code = statusToCode(err.status)
    return c.json<ErrorSchema>(
      {
        code: code,
        message: err.message,
        docs: `https://docs.openstatus.dev/api-references/errors/code/${code}`,
      },
      { status: err.status },
    )
  }
  return c.json<ErrorSchema>(
    {
      code: 'INTERNAL_SERVER_ERROR',
      message: err.message ?? 'Something went wrong',
      docs: 'https://docs.openstatus.dev/api-references/errors/code/INTERNAL_SERVER_ERROR',
    },

    { status: 500 },
  )
}
export function handleZodError(
  result:
    | {
        success: true
        data: unknown
      }
    | {
        success: false
        error: ZodError
      },
  c: Context,
) {
  if (!result.success) {
    const error = SchemaError.fromZod(result.error, c)
    return c.json<z.infer<ReturnType<typeof createErrorSchema>>>(
      {
        code: 'BAD_REQUEST',
        docs: 'https://docs.openstatus.dev/api-references/errors/code/BAD_REQUEST',
        message: error.message,
      },
      { status: 400 },
    )
  }
}
