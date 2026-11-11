import RBACPage from '#/features/rbac/pages/RBACPage/RBACPage'
import type { PaginationQueryDTO } from '#/shared/types/pagination-query-dto'
import { createFileRoute } from '@tanstack/react-router'



export const Route = createFileRoute('/_main-layout/settings/rbac/')({
  validateSearch: (params: PaginationQueryDTO): PaginationQueryDTO => {
    const page = params?.page ? Number(params.page) : 1
    const limit = params?.limit ? Number(params.limit) : 10
    const search = typeof params?.search === 'string' && params.search.trim() ? params.search.trim() : undefined

    return {
      page,
      limit,
      search
    }
  },
  component: RBACPage,
})
