const getAPIUrl = () => {
  if (Bun.env.NODE_ENV === 'development') {
    return 'http://localhost:3000'
  }

  return 'https://api.boring.tools'
}

export const fetchAPI = async (
  url: string,
  options: RequestInit,
  token: string,
) => {
  const response = await fetch(`${getAPIUrl()}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    ...options,
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}
