import type { UserOutput } from '@boring.tools/schema'
import { useAuth } from '@clerk/clerk-react'
import { useQuery } from '@tanstack/react-query'
import type { z } from 'zod'
import { queryFetch } from '../utils/queryFetch'

type User = z.infer<typeof UserOutput>

export const useUser = () => {
  const { getToken } = useAuth()
  return useQuery({
    queryKey: ['user'],
    queryFn: async (): Promise<Readonly<User>> =>
      await queryFetch({
        path: 'user',
        method: 'get',
        token: await getToken(),
      }),
    retry: false,
  })
}
