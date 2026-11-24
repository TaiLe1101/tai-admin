import { createFileRoute } from '@tanstack/react-router'
import type { UpgradeRequestListQuery } from '#/features/saas/api/dto/saasTypes'
import SaasUpgradeRequestsPage from '#/features/saas/pages/SaasUpgradeRequestsPage'

const positiveInteger = (
  value: unknown,
  fallback: number,
  max = Number.MAX_SAFE_INTEGER,
) => {
  const num = Number(value)
  return Number.isSafeInteger(num) && num > 0 ? Math.min(num, max) : fallback
}

export const Route = createFileRoute('/_main-layout/saas/upgrade-requests/')({
  validateSearch: (
    params: Record<string, unknown>,
  ): UpgradeRequestListQuery => ({
    page: positiveInteger(params.page, 1),
    limit: positiveInteger(params.limit, 20, 100),
    status:
      params.status === 'PENDING' ||
      params.status === 'APPROVED' ||
      params.status === 'REJECTED'
        ? params.status
        : undefined,
  }),
  component: SaasUpgradeRequestsPage,
})
