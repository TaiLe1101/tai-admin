import { createFileRoute } from '@tanstack/react-router'
import AppReleasesPage from '#/features/app-releases/pages/AppReleasesPage'
import type { AppReleaseQuery } from '#/features/app-releases/api/dto/req/appReleaseReq'

const positiveInteger = (
  value: unknown,
  fallback: number,
  max = Number.MAX_SAFE_INTEGER,
) => {
  const number = Number(value)
  return Number.isSafeInteger(number) && number > 0
    ? Math.min(number, max)
    : fallback
}

export const Route = createFileRoute('/_main-layout/applications/releases/')({
  validateSearch: (params: Record<string, unknown>): AppReleaseQuery => ({
    page: positiveInteger(params.page, 1),
    limit: positiveInteger(params.limit, 10, 100),
    q:
      typeof params.q === 'string' && params.q.trim()
        ? params.q.trim()
        : undefined,
    status:
      params.status === 'draft' || params.status === 'published'
        ? params.status
        : undefined,
    sortBy:
      params.sortBy === 'id' ||
      params.sortBy === 'version' ||
      params.sortBy === 'publishedAt'
        ? params.sortBy
        : 'createdAt',
    sortOrder: params.sortOrder === 'asc' ? 'asc' : 'desc',
  }),
  component: AppReleasesPage,
})
