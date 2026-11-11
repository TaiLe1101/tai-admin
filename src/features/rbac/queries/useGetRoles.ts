import { useAppSelector } from '#/app/store/hooks'
import { getRoles } from '#/features/rbac/api/rbacApi'
import type { PaginationQueryDTO } from '#/shared/types/pagination-query-dto'
import type { Role } from '#/shared/types/schema/Role'
import { useQuery } from '@tanstack/react-query'

export const GET_ROLES_QUERY_KEY = ['rbac', 'roles'] as const

export function useGetRoles(params?: PaginationQueryDTO) {
    const { isAuthenticated } = useAppSelector((state) => state.auth)

    return useQuery<Role[], Error>({
        queryKey: GET_ROLES_QUERY_KEY,
        queryFn: async () => (await getRoles(params)).data,
        enabled: isAuthenticated,
        staleTime: 5 * 60 * 1000,
    })
}

export default useGetRoles
