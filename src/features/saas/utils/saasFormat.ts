import { formatCurrency } from '#/shared/utils/formatCurrency'
import type {
  BillingCycle,
  PlanDto,
  SaasUserSummaryDto,
  SubscriptionStatus,
  TenantMemberRole,
  TenantStatus,
  TenantType,
  UpgradeRequestStatus,
} from '../api/dto/saasTypes'

export const TENANT_TYPE_META: Record<
  TenantType,
  { label: string; color: string }
> = {
  PERSONAL: { label: 'Cá nhân', color: 'blue' },
  ORGANIZATION: { label: 'Tổ chức', color: 'purple' },
}

export const TENANT_STATUS_META: Record<
  TenantStatus,
  { label: string; color: string }
> = {
  ACTIVE: { label: 'Hoạt động', color: 'green' },
  SUSPENDED: { label: 'Tạm khóa', color: 'red' },
}

export const MEMBER_ROLE_META: Record<
  TenantMemberRole,
  { label: string; color: string }
> = {
  OWNER: { label: 'Chủ sở hữu', color: 'gold' },
  ADMIN: { label: 'Quản trị', color: 'blue' },
  MEMBER: { label: 'Thành viên', color: 'default' },
}

export const SUBSCRIPTION_STATUS_META: Record<
  SubscriptionStatus,
  { label: string; color: string }
> = {
  ACTIVE: { label: 'Đang hoạt động', color: 'green' },
  EXPIRED: { label: 'Hết hạn', color: 'orange' },
  CANCELED: { label: 'Đã hủy', color: 'default' },
  PENDING: { label: 'Chờ kích hoạt', color: 'processing' },
}

export const BILLING_CYCLE_META: Record<
  BillingCycle,
  { label: string; color: string }
> = {
  MONTHLY: { label: 'Theo tháng', color: 'cyan' },
  YEARLY: { label: 'Theo năm', color: 'geekblue' },
  LIFETIME: { label: 'Trọn đời', color: 'purple' },
}

export const UPGRADE_REQUEST_STATUS_META: Record<
  UpgradeRequestStatus,
  { label: string; color: string }
> = {
  PENDING: { label: 'Chờ duyệt', color: 'gold' },
  APPROVED: { label: 'Đã duyệt', color: 'green' },
  REJECTED: { label: 'Từ chối', color: 'red' },
}

export function formatPlanPrice(amount: number, currency = 'VND'): string {
  if (amount <= 0) return 'Miễn phí'
  if (currency.toUpperCase() === 'VND') {
    return formatCurrency(amount)
  }
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency,
  }).format(amount)
}

export function formatMinutesLimit(minutes: number | null | undefined): string {
  if (minutes === null || minutes === undefined) return 'Không giới hạn'
  return `${new Intl.NumberFormat('vi-VN').format(minutes)} phút`
}

export function formatUsedMinutes(
  usedMinutes?: number,
  usedSeconds?: number,
): number {
  if (typeof usedMinutes === 'number' && !Number.isNaN(usedMinutes)) {
    return Math.round(usedMinutes * 10) / 10
  }
  if (typeof usedSeconds === 'number' && !Number.isNaN(usedSeconds)) {
    return Math.round((usedSeconds / 60) * 10) / 10
  }
  return 0
}

export function getQuotaPercent(
  usedMinutes: number,
  limitMinutes: number | null | undefined,
): number {
  if (!limitMinutes || limitMinutes <= 0) return 0
  return Math.min(100, Math.round((usedMinutes / limitMinutes) * 100))
}

export function formatSaasUserName(user?: SaasUserSummaryDto | null): string {
  if (!user) return '—'
  const full = `${user.firstName} ${user.lastName}`.trim()
  return full || user.username || user.email || `#${user.id}`
}

export function isFreePlan(plan?: PlanDto | null): boolean {
  return Boolean(plan && plan.priceMonthly === 0 && plan.priceYearly === 0)
}

export function getDefaultDurationDays(
  plan: PlanDto | null | undefined,
  billingCycle: BillingCycle,
): number | null {
  if (billingCycle === 'LIFETIME' || isFreePlan(plan)) return null
  return billingCycle === 'YEARLY' ? 365 : 30
}
