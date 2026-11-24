import { createFileRoute } from '@tanstack/react-router'
import type { TenantListQuery } from '#/features/saas/api/dto/saasTypes'
import SaasTenantsPage from '#/features/saas/pages/SaasTenantsPage'

const positiveInteger = (
  value: unknown,
  fallback: number,
  max = Number.MAX_SAFE_INTEGER,
) => {
  const num = Number(value)
  return Number.isSafeInteger(num) && num > 0 ? Math.min(num, max) : fallback
}

const optionalPositiveInteger = (value: unknown): number | undefined => {
  if (value === undefined || value === null || value === '') return undefined
  const num = Number(value)
  return Number.isSafeInteger(num) && num > 0 ? num : undefined
}

export const Route = createFileRoute('/_main-layout/saas/tenants/')({
  validateSearch: (params: Record<string, unknown>): TenantListQuery => ({
    page: positiveInteger(params.page, 1),
    limit: positiveInteger(params.limit, 20, 100),
    search:
      typeof params.search === 'string' && params.search.trim()
        ? params.search.trim()
        : undefined,
    type:
      params.type === 'PERSONAL' || params.type === 'ORGANIZATION'
        ? params.type
        : undefined,
    status:
      params.status === 'ACTIVE' || params.status === 'SUSPENDED'
        ? params.status
        : undefined,
    planId: optionalPositiveInteger(params.planId),
  }),
  component: SaasTenantsPage,
})
