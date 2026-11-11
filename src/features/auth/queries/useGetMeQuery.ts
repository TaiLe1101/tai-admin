import { useAppSelector } from '#/app/store/hooks'
import { getMeApi } from '#/features/auth/api/authApi'
import type { ResMe } from '#/features/auth/types'
import { useQuery } from '@tanstack/react-query'

export const GET_ME_QUERY_KEY = ['auth', 'me'] as const

export const fetchMe = async (): Promise<ResMe> => {
  const res = await getMeApi()
  return res.data
}

export function useGetMeQuery() {
  const { isAuthenticated } = useAppSelector((state) => state.auth)

  return useQuery<ResMe, Error>({
    queryKey: GET_ME_QUERY_KEY,
    queryFn: fetchMe,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  })
}

export default useGetMeQuery
