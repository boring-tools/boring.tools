import axios from 'axios'

type Fetch = {
  path: string
  method: 'get' | 'post' | 'put' | 'delete'
  data?: unknown
  token?: string | null
}

const url = import.meta.env.PROD
  ? 'https://api.boring.tools'
  : 'http://localhost:3000'

export const queryFetch = async ({ path, method, data, token }: Fetch) => {
  const response = await axios({
    method,
    url: `${url}/v1/${path}`,
    data,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data
}
