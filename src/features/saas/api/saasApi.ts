import axiosClient from '#/shared/api/axiosClient'
import type { ApiResponse } from '#/shared/types/api'
import type {
  AddTenantMemberReq,
  ApproveUpgradeRequestReq,
  AssignSubscriptionReq,
  CreatePlanReq,
  CreateTenantReq,
  PlanDto,
  QuotaDto,
  RejectUpgradeRequestReq,
  ResetTenantUsageReq,
  SaasOverviewDto,
  SaasPaginatedResponse,
  SaasUsersQuery,
  SaasUserSummaryDto,
  SubscriptionDto,
  TenantDetailDto,
  TenantDto,
  TenantListItemDto,
  TenantListQuery,
  TenantMemberDto,
  UpdatePlanReq,
  UpdateTenantReq,
  UpgradeRequestDto,
  UpgradeRequestListQuery,
} from './dto/saasTypes'

const ENDPOINT = '/admin/saas'

export const getSaasOverview = (): Promise<ApiResponse<SaasOverviewDto>> =>
  axiosClient.get(`${ENDPOINT}/overview`)

export const getSaasPlans = (): Promise<ApiResponse<PlanDto[]>> =>
  axiosClient.get(`${ENDPOINT}/plans`)

export const createSaasPlan = (
  payload: CreatePlanReq,
): Promise<ApiResponse<PlanDto>> => axiosClient.post(`${ENDPOINT}/plans`, payload)

export const updateSaasPlan = (
  id: number,
  payload: UpdatePlanReq,
): Promise<ApiResponse<PlanDto>> =>
  axiosClient.put(`${ENDPOINT}/plans/${id}`, payload)

export const deleteSaasPlan = (
  id: number,
): Promise<ApiResponse<{ deleted: true }>> =>
  axiosClient.delete(`${ENDPOINT}/plans/${id}`)

export const getSaasTenants = (
  params: TenantListQuery,
): Promise<SaasPaginatedResponse<TenantListItemDto>> =>
  axiosClient.get(`${ENDPOINT}/tenants`, { params })

export const getSaasTenantDetail = (
  id: number,
): Promise<ApiResponse<TenantDetailDto>> =>
  axiosClient.get(`${ENDPOINT}/tenants/${id}`)

export const createSaasTenant = (
  payload: CreateTenantReq,
): Promise<ApiResponse<TenantDetailDto>> =>
  axiosClient.post(`${ENDPOINT}/tenants`, payload)

export const updateSaasTenant = (
  id: number,
  payload: UpdateTenantReq,
): Promise<ApiResponse<TenantDto>> =>
  axiosClient.put(`${ENDPOINT}/tenants/${id}`, payload)

export const addSaasTenantMember = (
  tenantId: number,
  payload: AddTenantMemberReq,
): Promise<ApiResponse<TenantMemberDto>> =>
  axiosClient.post(`${ENDPOINT}/tenants/${tenantId}/members`, payload)

export const removeSaasTenantMember = (
  tenantId: number,
  userId: number,
): Promise<ApiResponse<{ removed: true }>> =>
  axiosClient.delete(`${ENDPOINT}/tenants/${tenantId}/members/${userId}`)

export const assignSaasTenantSubscription = (
  tenantId: number,
  payload: AssignSubscriptionReq,
): Promise<ApiResponse<SubscriptionDto>> =>
  axiosClient.post(`${ENDPOINT}/tenants/${tenantId}/subscriptions`, payload)

export const resetSaasTenantUsage = (
  tenantId: number,
  payload: ResetTenantUsageReq = {},
): Promise<ApiResponse<QuotaDto>> =>
  axiosClient.put(`${ENDPOINT}/tenants/${tenantId}/usage/reset`, payload)

export const getSaasUpgradeRequests = (
  params: UpgradeRequestListQuery,
): Promise<SaasPaginatedResponse<UpgradeRequestDto>> =>
  axiosClient.get(`${ENDPOINT}/upgrade-requests`, { params })

export const approveSaasUpgradeRequest = (
  id: number,
  payload: ApproveUpgradeRequestReq,
): Promise<ApiResponse<UpgradeRequestDto>> =>
  axiosClient.post(`${ENDPOINT}/upgrade-requests/${id}/approve`, payload)

export const rejectSaasUpgradeRequest = (
  id: number,
  payload: RejectUpgradeRequestReq,
): Promise<ApiResponse<UpgradeRequestDto>> =>
  axiosClient.post(`${ENDPOINT}/upgrade-requests/${id}/reject`, payload)

export const getSaasUsers = (
  params: SaasUsersQuery,
): Promise<SaasPaginatedResponse<SaasUserSummaryDto>> =>
  axiosClient.get(`${ENDPOINT}/users`, { params })
