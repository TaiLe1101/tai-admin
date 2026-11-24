import { createFileRoute } from '@tanstack/react-router'
import type {
  PaymentOrderStatus,
  SaasPaymentsRouteSearch,
  SaasPaymentsTab,
  SepayEventStatus,
} from '#/features/saas/api/dto/saasTypes'
import SaasPaymentsPage from '#/features/saas/pages/SaasPaymentsPage'

const positiveInteger = (
  value: unknown,
  fallback: number,
  max = Number.MAX_SAFE_INTEGER,
) => {
  const num = Number(value)
  return Number.isSafeInteger(num) && num > 0 ? Math.min(num, max) : fallback
}

const VALID_ORDER_STATUSES = new Set<PaymentOrderStatus>([
  'PENDING',
  'PAID',
  'EXPIRED',
  'CANCELED',
])

const VALID_EVENT_STATUSES = new Set<SepayEventStatus>([
  'RECEIVED',
  'PROCESSED',
  'UNMATCHED',
  'FAILED',
])

export const Route = createFileRoute('/_main-layout/saas/payments/')({
  validateSearch: (
    params: Record<string, unknown>,
  ): SaasPaymentsRouteSearch => {
    const tab: SaasPaymentsTab = params.tab === 'events' ? 'events' : 'orders'
    const orderStatus =
      typeof params.orderStatus === 'string' &&
      VALID_ORDER_STATUSES.has(params.orderStatus as PaymentOrderStatus)
        ? (params.orderStatus as PaymentOrderStatus)
        : undefined
    const eventStatus =
      typeof params.eventStatus === 'string' &&
      VALID_EVENT_STATUSES.has(params.eventStatus as SepayEventStatus)
        ? (params.eventStatus as SepayEventStatus)
        : undefined

    return {
      tab,
      page: positiveInteger(params.page, 1),
      limit: positiveInteger(params.limit, 20, 100),
      orderStatus,
      eventStatus,
      search:
        typeof params.search === 'string' && params.search.trim()
          ? params.search.trim()
          : undefined,
    }
  },
  component: SaasPaymentsPage,
})
