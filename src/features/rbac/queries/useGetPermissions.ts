import { useAppSelector } from '#/app/store/hooks'
import { getPermissionsApi } from '#/features/rbac/api/rbacApi'
import type { GetPermissionsRes } from '#/features/rbac/api/dto/res/getPermissionsRes'
import { useQuery } from '@tanstack/react-query'

export const GET_PERMISSIONS_QUERY_KEY = ['rbac', 'permissions'] as const

export function useGetPermissions() {
  const { isAuthenticated } = useAppSelector((state) => state.auth)

  return useQuery<GetPermissionsRes, Error>({
    queryKey: GET_PERMISSIONS_QUERY_KEY,
    queryFn: async () => (await getPermissionsApi()).data,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  })
}

export default useGetPermissions

