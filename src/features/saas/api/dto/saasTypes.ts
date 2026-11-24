import type { ApiResponse } from '#/shared/types/api'

export type TenantType = 'PERSONAL' | 'ORGANIZATION'
export type TenantStatus = 'ACTIVE' | 'SUSPENDED'
export type TenantMemberRole = 'OWNER' | 'ADMIN' | 'MEMBER'
export type SubscriptionStatus = 'ACTIVE' | 'EXPIRED' | 'CANCELED' | 'PENDING'
export type BillingCycle = 'MONTHLY' | 'YEARLY' | 'LIFETIME'
export type UpgradeRequestBillingCycle = 'MONTHLY' | 'YEARLY'
export type UpgradeRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED'
export type QuotaBlockReason =
  | 'TENANT_SUSPENDED'
  | 'SUBSCRIPTION_EXPIRED'
  | 'QUOTA_EXCEEDED'
  | 'NO_SUBSCRIPTION'

export interface SaasPagination {
  page: number
  limit: number
  total?: number
  totalPages?: number
  totalItems?: number
  totalPage?: number
}

export interface SaasPaginatedResponse<T> extends ApiResponse<T[]> {
  pagination?: SaasPagination
}

export interface PlanDto {
  id: number
  code: string
  name: string
  description: string | null
  badge: string | null
  priceMonthly: number
  priceYearly: number
  currency: string
  monthlyMinutesLimit: number | null
  maxSeats: number
  features: string[]
  isPublic: boolean
  isDefault: boolean
  isHighlighted: boolean
  sortOrder: number
  isActive: boolean
}

export interface TenantDto {
  id: number
  code: string
  name: string
  type: TenantType
  status: TenantStatus
  contactEmail: string | null
  notes: string | null
  createdAt: string
}

export interface SubscriptionDto {
  id: number
  tenantId: number
  planId: number
  status: SubscriptionStatus
  billingCycle: BillingCycle
  startsAt: string
  expiresAt: string | null
  monthlyMinutesLimitOverride: number | null
  note: string | null
  plan: PlanDto
}

export interface QuotaDto {
  period: string
  usedSeconds: number
  usedMinutes: number
  limitMinutes: number | null
  remainingMinutes: number | null
  isUnlimited: boolean
  canDub: boolean
  blockReason: QuotaBlockReason | null
}

export interface SaasUserSummaryDto {
  id: number
  username: string
  email: string | null
  firstName: string
  lastName: string
  isActive?: boolean
  isRoot?: boolean
}

export interface UpgradeRequestDto {
  id: number
  tenantId: number
  userId: number
  requestedPlanId: number
  billingCycle: UpgradeRequestBillingCycle
  status: UpgradeRequestStatus
  contactNote: string | null
  adminNote: string | null
  createdAt: string
  resolvedAt: string | null
  tenant?: TenantDto
  requestedPlan?: PlanDto
  user?: SaasUserSummaryDto
}

export interface PlanDistributionItemDto {
  planId: number
  code: string
  name: string
  count: number
}

export interface SaasOverviewDto {
  totalTenants: number
  activeTenants: number
  suspendedTenants: number
  totalUsers: number
  activeSubscriptions: number
  pendingUpgradeRequests: number
  currentPeriod: string
  totalUsedMinutesThisMonth: number
  planDistribution: PlanDistributionItemDto[]
}

export interface TenantCurrentUsageDto {
  period: string
  usedSeconds: number
  usedMinutes: number
  limitMinutes: number | null
}

export interface TenantListItemDto extends TenantDto {
  memberCount: number
  activeSubscription: SubscriptionDto | null
  currentUsage: TenantCurrentUsageDto
}

export interface TenantMemberDto {
  id?: number
  tenantId: number
  userId: number
  role: TenantMemberRole
  createdAt?: string
  user?: SaasUserSummaryDto
}

export interface TenantUsageHistoryItemDto {
  id?: number
  tenantId?: number
  period: string
  usedSeconds: number
  usedMinutes?: number
  dubbedCues?: number
  sessionsCount?: number
  updatedAt?: string
}

export interface TenantDetailDto extends TenantDto {
  members: TenantMemberDto[]
  subscriptions: SubscriptionDto[]
  usageHistory: TenantUsageHistoryItemDto[]
  upgradeRequests: UpgradeRequestDto[]
  quota?: QuotaDto
  activeSubscription?: SubscriptionDto | null
}

export interface CreatePlanReq {
  code: string
  name: string
  description?: string | null
  badge?: string | null
  priceMonthly: number
  priceYearly: number
  currency?: string
  monthlyMinutesLimit: number | null
  maxSeats: number
  features: string[]
  isPublic?: boolean
  isDefault?: boolean
  isHighlighted?: boolean
  sortOrder?: number
  isActive?: boolean
}

export type UpdatePlanReq = Partial<CreatePlanReq>

export interface TenantListQuery {
  page: number
  limit: number
  search?: string
  type?: TenantType
  status?: TenantStatus
  planId?: number
}

export interface CreateTenantReq {
  name: string
  code?: string
  type?: TenantType
  contactEmail?: string | null
  notes?: string | null
  ownerUserId?: number
  initialPlanId?: number
  billingCycle?: BillingCycle
  durationDays?: number | null
  expiresAt?: string | null
}

export interface UpdateTenantReq {
  name?: string
  status?: TenantStatus
  type?: TenantType
  contactEmail?: string | null
  notes?: string | null
}

export interface AddTenantMemberReq {
  userId?: number
  identifier?: string
  role?: TenantMemberRole
}

export interface AssignSubscriptionReq {
  planId: number
  billingCycle?: BillingCycle
  startsAt?: string
  expiresAt?: string | null
  durationDays?: number | null
  monthlyMinutesLimitOverride?: number | null
  note?: string | null
}

export interface ResetTenantUsageReq {
  period?: string
}

export interface UpgradeRequestListQuery {
  page: number
  limit: number
  status?: UpgradeRequestStatus
}

export interface ApproveUpgradeRequestReq {
  durationDays?: number | null
  expiresAt?: string | null
  monthlyMinutesLimitOverride?: number | null
  adminNote?: string | null
}

export interface RejectUpgradeRequestReq {
  adminNote?: string | null
}

export interface SaasUsersQuery {
  page?: number
  limit?: number
  search?: string
}

export type PaymentOrderStatus = 'PENDING' | 'PAID' | 'EXPIRED' | 'CANCELED'
export type PaymentPaidSource = 'WEBHOOK' | 'RECONCILIATION'
export type SepayEventStatus = 'RECEIVED' | 'PROCESSED' | 'UNMATCHED' | 'FAILED'
export type SepayEnv = 'sandbox' | 'production'

export interface PaymentOrderDto {
  id: number
  paymentCode: string
  tenantId: number
  userId: number
  planId: number
  billingCycle: UpgradeRequestBillingCycle
  amount: number
  currency: string
  status: PaymentOrderStatus
  bankCode: string
  accountNumber: string
  accountName: string
  transferContent: string
  qrUrl: string | null
  expiresAt: string
  paidAt: string | null
  paidAmount: number | null
  paidSource: PaymentPaidSource | null
  paidReferenceCode: string | null
  createdAt: string
  plan?: { id: number; code: string; name: string }
  tenant?: { id: number; code: string; name: string }
}

export interface SepayWebhookEventAdminDto {
  id: number
  sepayWebhookId: string
  gateway: string
  transactionDate: string
  maskedAccountNumber: string
  subAccount: string | null
  code: string | null
  transferType: string
  transferAmount: number
  referenceCode: string | null
  status: SepayEventStatus
  verdict: boolean
  unmatchedReason: string | null
  orderId: number | null
  paymentCode: string | null
  createdAt: string
}

export interface SepayReconcileSummaryDto {
  enabled: boolean
  env: SepayEnv
  lastRunAt: string | null
  lastCursorId: string | null
  lastFetchedCount: number
  lastMatchedCount: number
  lastUnmatchedCount: number
  pendingOrders: number
  paidOrders: number
  unmatchedEvents: number
}

export interface PaymentOrderReconcileResultDto {
  matched: boolean
  order: PaymentOrderDto
  checkedTransactions: number
}

export interface SepayReconcileRunResultDto {
  fetched: number
  matched: number
  unmatched: number
  alreadyHandled: number
  cursorId: string | null
}

export interface PaymentOrderListQuery {
  page: number
  limit: number
  status?: PaymentOrderStatus
  search?: string
}

export interface SepayEventListQuery {
  page: number
  limit: number
  status?: SepayEventStatus
  search?: string
}

export type SaasPaymentsTab = 'orders' | 'events'

export interface SaasPaymentsRouteSearch {
  tab: SaasPaymentsTab
  page: number
  limit: number
  orderStatus?: PaymentOrderStatus
  eventStatus?: SepayEventStatus
  search?: string
}

export function getPaginationTotal(pagination?: SaasPagination): number {
  return pagination?.total ?? pagination?.totalItems ?? 0
}

export function getPaginationTotalPages(pagination?: SaasPagination): number {
  return Math.max(1, pagination?.totalPages ?? pagination?.totalPage ?? 1)
}
