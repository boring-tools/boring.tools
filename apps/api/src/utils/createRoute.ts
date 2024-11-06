import { type RouteConfig, createRoute as route } from '@hono/zod-openapi'
import { openApiErrorResponses } from './openapi'

type CreateRoute = {
  method: 'get' | 'post' | 'put' | 'delete'
  tags: string[]
  description: string
  path: string
  responses: RouteConfig['responses']
  request?: RouteConfig['request']
}

export const createRoute = (input: CreateRoute) =>
  route({
    ...input,
    responses: {
      ...input.responses,
      ...openApiErrorResponses,
    },
    security: [
      {
        Clerk: [],
        AccessToken: [],
      },
    ],
  })
