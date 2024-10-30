import type {
  AccessTokenCreateInput,
  AccessTokenListOutput,
  AccessTokenOutput,
} from '@boring.tools/schema'
import { useAuth } from '@clerk/clerk-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { z } from 'zod'
import { queryFetch } from '../utils/queryFetch'

type AccessToken = z.infer<typeof AccessTokenOutput>
type AccessTokenList = z.infer<typeof AccessTokenListOutput>
type AccessTokenCreate = z.infer<typeof AccessTokenCreateInput>

export const useAccessTokenList = () => {
  const { getToken } = useAuth()
  return useQuery({
    queryKey: ['accessTokenList'],
    queryFn: async (): Promise<AccessTokenList> =>
      await queryFetch({
        path: 'access-token',
        method: 'get',
        token: await getToken(),
      }),
  })
}

export const useAccessTokenCreate = () => {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (
      payload: AccessTokenCreate,
    ): Promise<Readonly<AccessToken>> =>
      await queryFetch({
        path: 'access-token',
        data: payload,
        method: 'post',
        token: await getToken(),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accessTokenList'] })
    },
  })
}

export const useAccessTokenDelete = () => {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
    }: { id: string }): Promise<Readonly<AccessToken>> =>
      await queryFetch({
        path: `access-token/${id}`,
        method: 'delete',
        token: await getToken(),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['accessTokenList'],
      })
    },
  })
}
