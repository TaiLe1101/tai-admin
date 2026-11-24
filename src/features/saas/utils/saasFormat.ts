import { formatCurrency } from '#/shared/utils/formatCurrency'
import type {
  BillingCycle,
  PaymentOrderStatus,
  PaymentPaidSource,
  PlanDto,
  SaasUserSummaryDto,
  SepayEventStatus,
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

export const PAYMENT_ORDER_STATUS_META: Record<
  PaymentOrderStatus,
  { label: string; color: string }
> = {
  PENDING: { label: 'Chờ thanh toán', color: 'gold' },
  PAID: { label: 'Đã thanh toán', color: 'green' },
  EXPIRED: { label: 'Hết hạn', color: 'default' },
  CANCELED: { label: 'Đã hủy', color: 'red' },
}

export const PAYMENT_PAID_SOURCE_META: Record<
  PaymentPaidSource,
  { label: string; color: string }
> = {
  WEBHOOK: { label: 'Webhook', color: 'blue' },
  RECONCILIATION: { label: 'Đối soát API', color: 'purple' },
}

export const SEPAY_EVENT_STATUS_META: Record<
  SepayEventStatus,
  { label: string; color: string }
> = {
  RECEIVED: { label: 'Đã nhận', color: 'default' },
  PROCESSED: { label: 'Đã xử lý', color: 'green' },
  UNMATCHED: { label: 'Cần đối soát', color: 'orange' },
  FAILED: { label: 'Lỗi xử lý', color: 'red' },
}

const UNMATCHED_REASON_LABELS: Record<string, string> = {
  AMOUNT_MISMATCH: 'Sai số tiền chuyển khoản',
  INVALID_AMOUNT: 'Số tiền giao dịch không hợp lệ',
  UNDERPAID: 'Chuyển thiếu tiền',
  OVERPAID: 'Chuyển dư tiền',
  ACCOUNT_MISMATCH: 'Sai tài khoản thụ hưởng',
  ORDER_EXPIRED: 'Thanh toán sau khi đơn hết hạn',
  ORDER_CANCELED: 'Thanh toán sau khi đơn đã hủy',
  LATE_PAYMENT: 'Thanh toán muộn (đơn hết hạn / đã hủy)',
  ORDER_NOT_PENDING: 'Đơn không còn ở trạng thái chờ',
  SECOND_PAYMENT: 'Thanh toán trùng lặp cho đơn đã trả',
  DUPLICATE_PAYMENT: 'Thanh toán trùng lặp',
  ORDER_NOT_FOUND: 'Không tìm thấy đơn thanh toán',
  UNKNOWN_CODE: 'Không rõ mã thanh toán',
  EMPTY_CODE: 'Thiếu mã thanh toán (code)',
  MISSING_CODE: 'Thiếu mã thanh toán (code)',
  NON_INCOMING_TRANSFER: 'Giao dịch không phải tiền vào',
  OUTGOING_TRANSFER: 'Giao dịch tiền ra (không phải tiền vào)',
  INVALID_TRANSFER_TYPE: 'Loại giao dịch không hợp lệ',
}

export function formatUnmatchedReason(reason: string | null): string {
  if (!reason) return '—'
  const normalized = reason.trim().toUpperCase()
  return UNMATCHED_REASON_LABELS[normalized] ?? reason
}
