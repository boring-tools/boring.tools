import type {
  PageByIdOutput,
  PageCreateInput,
  PageListOutput,
  PageOutput,
  PageUpdateInput,
} from '@boring.tools/schema'
import { useAuth } from '@clerk/clerk-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { z } from 'zod'
import { queryFetch } from '../utils/queryFetch'

type Page = z.infer<typeof PageOutput>
type PageList = z.infer<typeof PageListOutput>
type PageById = z.infer<typeof PageByIdOutput>
type PageCreate = z.infer<typeof PageCreateInput>
type PageUpdate = z.infer<typeof PageUpdateInput>

export const usePageList = () => {
  const { getToken } = useAuth()
  return useQuery({
    queryKey: ['pageList'],
    queryFn: async (): Promise<ReadonlyArray<PageList>> =>
      await queryFetch({
        path: 'page',
        method: 'get',
        token: await getToken(),
      }),
  })
}

export const usePageById = ({ id }: { id: string }) => {
  const { getToken } = useAuth()

  return useQuery({
    queryKey: ['pageById', id],
    queryFn: async (): Promise<Readonly<PageById>> =>
      await queryFetch({
        path: `page/${id}`,
        method: 'get',
        token: await getToken(),
      }),
  })
}

export const usePageCreate = () => {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: PageCreate): Promise<Readonly<Page>> =>
      await queryFetch({
        path: 'page',
        data: payload,
        method: 'post',
        token: await getToken(),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pageList'] })
    },
  })
}

export const usePageDelete = () => {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id }: { id: string }): Promise<Readonly<Page>> =>
      await queryFetch({
        path: `page/${id}`,
        method: 'delete',
        token: await getToken(),
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['pageList', 'pageById', data.id],
      })
    },
  })
}

export const usePageUpdate = () => {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string
      payload: PageUpdate
    }): Promise<Readonly<Page>> =>
      await queryFetch({
        path: `page/${id}`,
        data: payload,
        method: 'put',
        token: await getToken(),
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['pageById', data.id],
      })
      queryClient.invalidateQueries({
        queryKey: ['pageList'],
      })
    },
  })
}
/* 


export const useChangelogVersionCreate = () => {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: VersionCreate): Promise<Readonly<Version>> =>
      await queryFetch({
        path: 'changelog/version',
        data: payload,
        method: 'post',
        token: await getToken(),
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['changelogList'] })
      queryClient.invalidateQueries({
        queryKey: ['changelogById', data.changelogId],
      })
    },
  })
}

export const useChangelogVersionById = ({ id }: { id: string }) => {
  const { getToken } = useAuth()

  return useQuery({
    queryKey: ['changelogVersionById', id],
    queryFn: async (): Promise<Readonly<Version>> =>
      await queryFetch({
        path: `changelog/version/${id}`,
        method: 'get',
        token: await getToken(),
      }),
  })
}

export const useChangelogVersionUpdate = () => {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string
      payload: VersionUpdate
    }): Promise<Readonly<Version>> =>
      await queryFetch({
        path: `changelog/version/${id}`,
        data: payload,
        method: 'put',
        token: await getToken(),
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['changelogById', data.id],
      })
    },
  })
}

export const useChangelogVersionRemove = () => {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id }: { id: string }): Promise<Readonly<Version>> =>
      await queryFetch({
        path: `changelog/version/${id}`,
        method: 'delete',
        token: await getToken(),
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['changelogList', 'changelogById', data.id],
      })
    },
  })
}
 */
