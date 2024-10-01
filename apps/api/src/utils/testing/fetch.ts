import { app } from '../..'

export const fetch = async (
  {
    method,
    body,
    path,
  }: {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE'
    body?: Record<string, unknown> | Record<string, unknown>[]
    path: string
  },
  token: string,
) => {
  try {
    // const token = await authorization(user)
    const headers = new Headers({
      Authorization: `Bearer ${token}`,
      'content-type': 'application/json',
    })

    return app.request(path, {
      method,
      body: JSON.stringify(body),
      headers,
    })
  } catch (error) {
    throw new Error(error)
  }
}
