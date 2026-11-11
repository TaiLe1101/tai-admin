import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { App } from 'antd'
import { getAppRelease, getAppReleases } from '../api/appReleaseApi'
import type { AppReleaseQuery } from '../api/dto/req/appReleaseReq'

export const APP_RELEASES_QUERY_KEY = ['app-releases'] as const

function useQueryError(error: Error | null) {
  const { message } = App.useApp()
  useEffect(() => {
    if (error) void message.error(error.message)
  }, [error, message])
}

export function useAppReleases(params: AppReleaseQuery) {
  const query = useQuery({
    queryKey: [...APP_RELEASES_QUERY_KEY, 'list', params],
    queryFn: () => getAppReleases(params),
  })
  useQueryError(query.error)
  return query
}

export function useAppRelease(id: number | null) {
  const query = useQuery({
    queryKey: [...APP_RELEASES_QUERY_KEY, 'detail', id],
    queryFn: async () => (await getAppRelease(id!)).data,
    enabled: id !== null,
  })
  useQueryError(query.error)
  return query
}
