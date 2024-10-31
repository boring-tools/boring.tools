import type { StatisticOutput } from '@boring.tools/schema'
import { useAuth } from '@clerk/clerk-react'
import { useQuery } from '@tanstack/react-query'
import type { z } from 'zod'
import { queryFetch } from '../utils/queryFetch'

type Statistic = z.infer<typeof StatisticOutput>

export const useStatistic = () => {
  const { getToken } = useAuth()
  return useQuery({
    queryKey: ['statistic'],
    queryFn: async (): Promise<Readonly<Statistic>> =>
      await queryFetch({
        path: 'statistic',
        method: 'get',
        token: await getToken(),
      }),
  })
}
