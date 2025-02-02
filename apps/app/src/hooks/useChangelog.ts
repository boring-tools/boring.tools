import type {
  ChangelogCreateInput,
  ChangelogOutput,
  ChangelogUpdateInput,
  CommitOutput,
  VersionCreateAutoInput,
  VersionCreateInput,
  VersionOutput,
  VersionUpdateInput,
} from '@boring.tools/schema'
import { useAuth } from '@clerk/clerk-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { z } from 'zod'
import { queryFetch } from '../utils/queryFetch'

type Changelog = z.infer<typeof ChangelogOutput>
type ChangelogCreate = z.infer<typeof ChangelogCreateInput>
type ChangelogUpdate = z.infer<typeof ChangelogUpdateInput>

type Version = z.infer<typeof VersionOutput>
type VersionCreate = z.infer<typeof VersionCreateInput>
type VersionCreateAuto = z.infer<typeof VersionCreateAutoInput>
type VersionUpdate = z.infer<typeof VersionUpdateInput>

type Commit = z.infer<typeof CommitOutput>

export const useChangelogList = () => {
  const { getToken } = useAuth()
  return useQuery({
    queryKey: ['changelogList'],
    queryFn: async (): Promise<ReadonlyArray<Changelog>> =>
      await queryFetch({
        path: 'changelog',
        method: 'get',
        token: await getToken(),
      }),
  })
}

export const useChangelogCommitList = ({
  id,
  limit,
  offset,
}: { id: string; limit?: number; offset?: number }) => {
  const { getToken } = useAuth()
  return useQuery({
    queryKey: ['changelogCommitList'],
    queryFn: async (): Promise<ReadonlyArray<Commit>> =>
      await queryFetch({
        path: `changelog/commit?changelogId=${id}&limit=${limit}&offset=${offset}`,
        method: 'get',
        token: await getToken(),
      }),
  })
}

export const useChangelogById = ({ id }: { id: string }) => {
  const { getToken } = useAuth()

  return useQuery({
    queryKey: ['changelogById', id],
    queryFn: async (): Promise<Readonly<Changelog>> =>
      await queryFetch({
        path: `changelog/${id}`,
        method: 'get',
        token: await getToken(),
      }),
  })
}

export const useChangelogCreate = () => {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (
      payload: ChangelogCreate,
    ): Promise<Readonly<Changelog>> =>
      await queryFetch({
        path: 'changelog',
        data: payload,
        method: 'post',
        token: await getToken(),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['changelogList'] })
    },
  })
}

export const useChangelogUpdate = () => {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string
      payload: ChangelogUpdate
    }): Promise<Readonly<Changelog>> =>
      await queryFetch({
        path: `changelog/${id}`,
        data: payload,
        method: 'put',
        token: await getToken(),
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['changelogById', data.id],
      })
      queryClient.invalidateQueries({
        queryKey: ['changelogList'],
      })
    },
  })
}

export const useChangelogRemove = () => {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id }: { id: string }): Promise<Readonly<Changelog>> =>
      await queryFetch({
        path: `changelog/${id}`,
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

export const useChangelogVersionCreateAuto = () => {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (
      payload: VersionCreateAuto,
    ): Promise<Readonly<Version>> =>
      await queryFetch({
        path: 'changelog/version/auto',
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
