import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { App } from 'antd'
import {
  getSaasOverview,
  getSaasPlans,
  getSaasTenantDetail,
  getSaasTenants,
  getSaasUpgradeRequests,
  getSaasUsers,
} from '../api/saasApi'
import type {
  SaasUsersQuery,
  TenantListQuery,
  UpgradeRequestListQuery,
} from '../api/dto/saasTypes'

export const SAAS_QUERY_KEYS = {
  all: ['saas'] as const,
  overview: () => ['saas', 'overview'] as const,
  plans: () => ['saas', 'plans'] as const,
  tenants: () => ['saas', 'tenants'] as const,
  tenantList: (params: TenantListQuery) =>
    ['saas', 'tenants', 'list', params] as const,
  tenantDetail: (id: number | null) =>
    ['saas', 'tenants', 'detail', id] as const,
  upgradeRequests: () => ['saas', 'upgrade-requests'] as const,
  upgradeRequestList: (params: UpgradeRequestListQuery) =>
    ['saas', 'upgrade-requests', 'list', params] as const,
  users: (params: SaasUsersQuery) => ['saas', 'users', params] as const,
}

function useQueryError(error: Error | null) {
  const { message } = App.useApp()
  useEffect(() => {
    if (error) void message.error(error.message)
  }, [error, message])
}

export function useSaasOverview() {
  const query = useQuery({
    queryKey: SAAS_QUERY_KEYS.overview(),
    queryFn: async () => (await getSaasOverview()).data,
  })
  useQueryError(query.error)
  return query
}

export function useSaasPlans() {
  const query = useQuery({
    queryKey: SAAS_QUERY_KEYS.plans(),
    queryFn: async () => (await getSaasPlans()).data,
  })
  useQueryError(query.error)
  return query
}

export function useSaasTenants(params: TenantListQuery) {
  const query = useQuery({
    queryKey: SAAS_QUERY_KEYS.tenantList(params),
    queryFn: () => getSaasTenants(params),
  })
  useQueryError(query.error)
  return query
}

export function useSaasTenantDetail(id: number | null) {
  const query = useQuery({
    queryKey: SAAS_QUERY_KEYS.tenantDetail(id),
    queryFn: async () => (await getSaasTenantDetail(id!)).data,
    enabled: id !== null,
  })
  useQueryError(query.error)
  return query
}

export function useSaasUpgradeRequests(params: UpgradeRequestListQuery) {
  const query = useQuery({
    queryKey: SAAS_QUERY_KEYS.upgradeRequestList(params),
    queryFn: () => getSaasUpgradeRequests(params),
  })
  useQueryError(query.error)
  return query
}

export function useSaasUsers(params: SaasUsersQuery, enabled = true) {
  const query = useQuery({
    queryKey: SAAS_QUERY_KEYS.users(params),
    queryFn: async () => (await getSaasUsers(params)).data,
    enabled,
  })
  useQueryError(query.error)
  return query
}
