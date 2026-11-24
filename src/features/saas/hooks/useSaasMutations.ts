import { useMutation, useQueryClient } from '@tanstack/react-query'
import { App } from 'antd'
import {
  addSaasTenantMember,
  approveSaasUpgradeRequest,
  assignSaasTenantSubscription,
  cancelSaasPaymentOrder,
  createSaasPlan,
  createSaasTenant,
  deleteSaasPlan,
  reconcileSaasPaymentOrder,
  rejectSaasUpgradeRequest,
  removeSaasTenantMember,
  resetSaasTenantUsage,
  runSaasPaymentsReconcile,
  updateSaasPlan,
  updateSaasTenant,
} from '../api/saasApi'
import type {
  AddTenantMemberReq,
  ApproveUpgradeRequestReq,
  AssignSubscriptionReq,
  CreatePlanReq,
  CreateTenantReq,
  RejectUpgradeRequestReq,
  ResetTenantUsageReq,
  UpdatePlanReq,
  UpdateTenantReq,
} from '../api/dto/saasTypes'
import { SAAS_QUERY_KEYS } from '../queries/useSaasQueries'

export function useCreateSaasPlan() {
  const { message } = App.useApp()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreatePlanReq) => createSaasPlan(payload),
    onSuccess: (res) => {
      void message.success(res.message || 'Tạo gói dịch vụ thành công')
      void queryClient.invalidateQueries({ queryKey: SAAS_QUERY_KEYS.plans() })
      void queryClient.invalidateQueries({
        queryKey: SAAS_QUERY_KEYS.overview(),
      })
    },
    onError: (error) => {
      void message.error(error.message)
    },
  })
}

export function useUpdateSaasPlan() {
  const { message } = App.useApp()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdatePlanReq }) =>
      updateSaasPlan(id, payload),
    onSuccess: (res) => {
      void message.success(res.message || 'Cập nhật gói dịch vụ thành công')
      void queryClient.invalidateQueries({ queryKey: SAAS_QUERY_KEYS.plans() })
      void queryClient.invalidateQueries({
        queryKey: SAAS_QUERY_KEYS.overview(),
      })
      void queryClient.invalidateQueries({
        queryKey: SAAS_QUERY_KEYS.tenants(),
      })
    },
    onError: (error) => {
      void message.error(error.message)
    },
  })
}

export function useDeleteSaasPlan() {
  const { message } = App.useApp()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteSaasPlan(id),
    onSuccess: (res) => {
      void message.success(res.message || 'Xóa gói dịch vụ thành công')
      void queryClient.invalidateQueries({ queryKey: SAAS_QUERY_KEYS.plans() })
      void queryClient.invalidateQueries({
        queryKey: SAAS_QUERY_KEYS.overview(),
      })
    },
    onError: (error) => {
      void message.error(error.message)
    },
  })
}

export function useCreateSaasTenant() {
  const { message } = App.useApp()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateTenantReq) => createSaasTenant(payload),
    onSuccess: (res) => {
      void message.success(res.message || 'Tạo Tenant thành công')
      void queryClient.invalidateQueries({
        queryKey: SAAS_QUERY_KEYS.tenants(),
      })
      void queryClient.invalidateQueries({
        queryKey: SAAS_QUERY_KEYS.overview(),
      })
    },
    onError: (error) => {
      void message.error(error.message)
    },
  })
}

export function useUpdateSaasTenant() {
  const { message } = App.useApp()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateTenantReq }) =>
      updateSaasTenant(id, payload),
    onSuccess: (res, variables) => {
      void message.success(res.message || 'Cập nhật Tenant thành công')
      void queryClient.invalidateQueries({
        queryKey: SAAS_QUERY_KEYS.tenants(),
      })
      void queryClient.invalidateQueries({
        queryKey: SAAS_QUERY_KEYS.tenantDetail(variables.id),
      })
      void queryClient.invalidateQueries({
        queryKey: SAAS_QUERY_KEYS.overview(),
      })
    },
    onError: (error) => {
      void message.error(error.message)
    },
  })
}

export function useAddSaasTenantMember() {
  const { message } = App.useApp()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      tenantId,
      payload,
    }: {
      tenantId: number
      payload: AddTenantMemberReq
    }) => addSaasTenantMember(tenantId, payload),
    onSuccess: (res, variables) => {
      void message.success(res.message || 'Cập nhật thành viên thành công')
      void queryClient.invalidateQueries({
        queryKey: SAAS_QUERY_KEYS.tenantDetail(variables.tenantId),
      })
      void queryClient.invalidateQueries({
        queryKey: SAAS_QUERY_KEYS.tenants(),
      })
    },
    onError: (error) => {
      void message.error(error.message)
    },
  })
}

export function useRemoveSaasTenantMember() {
  const { message } = App.useApp()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      tenantId,
      userId,
    }: {
      tenantId: number
      userId: number
    }) => removeSaasTenantMember(tenantId, userId),
    onSuccess: (res, variables) => {
      void message.success(res.message || 'Đã xóa thành viên khỏi Tenant')
      void queryClient.invalidateQueries({
        queryKey: SAAS_QUERY_KEYS.tenantDetail(variables.tenantId),
      })
      void queryClient.invalidateQueries({
        queryKey: SAAS_QUERY_KEYS.tenants(),
      })
    },
    onError: (error) => {
      void message.error(error.message)
    },
  })
}

export function useAssignSaasTenantSubscription() {
  const { message } = App.useApp()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      tenantId,
      payload,
    }: {
      tenantId: number
      payload: AssignSubscriptionReq
    }) => assignSaasTenantSubscription(tenantId, payload),
    onSuccess: (res, variables) => {
      void message.success(
        res.message || 'Gán / gia hạn gói dịch vụ thành công',
      )
      void queryClient.invalidateQueries({
        queryKey: SAAS_QUERY_KEYS.tenantDetail(variables.tenantId),
      })
      void queryClient.invalidateQueries({
        queryKey: SAAS_QUERY_KEYS.tenants(),
      })
      void queryClient.invalidateQueries({
        queryKey: SAAS_QUERY_KEYS.overview(),
      })
    },
    onError: (error) => {
      void message.error(error.message)
    },
  })
}

export function useResetSaasTenantUsage() {
  const { message } = App.useApp()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      tenantId,
      payload,
    }: {
      tenantId: number
      payload?: ResetTenantUsageReq
    }) => resetSaasTenantUsage(tenantId, payload),
    onSuccess: (res, variables) => {
      void message.success(res.message || 'Đã đặt lại hạn mức sử dụng')
      void queryClient.invalidateQueries({
        queryKey: SAAS_QUERY_KEYS.tenantDetail(variables.tenantId),
      })
      void queryClient.invalidateQueries({
        queryKey: SAAS_QUERY_KEYS.tenants(),
      })
      void queryClient.invalidateQueries({
        queryKey: SAAS_QUERY_KEYS.overview(),
      })
    },
    onError: (error) => {
      void message.error(error.message)
    },
  })
}

export function useApproveSaasUpgradeRequest() {
  const { message } = App.useApp()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number
      payload: ApproveUpgradeRequestReq
    }) => approveSaasUpgradeRequest(id, payload),
    onSuccess: (res) => {
      void message.success(
        res.message || 'Đã duyệt yêu cầu và kích hoạt gói cho Tenant',
      )
      void queryClient.invalidateQueries({
        queryKey: SAAS_QUERY_KEYS.upgradeRequests(),
      })
      void queryClient.invalidateQueries({
        queryKey: SAAS_QUERY_KEYS.tenants(),
      })
      void queryClient.invalidateQueries({
        queryKey: SAAS_QUERY_KEYS.overview(),
      })
    },
    onError: (error) => {
      void message.error(error.message)
    },
  })
}

export function useRejectSaasUpgradeRequest() {
  const { message } = App.useApp()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number
      payload: RejectUpgradeRequestReq
    }) => rejectSaasUpgradeRequest(id, payload),
    onSuccess: (res) => {
      void message.success(res.message || 'Đã từ chối yêu cầu nâng cấp')
      void queryClient.invalidateQueries({
        queryKey: SAAS_QUERY_KEYS.upgradeRequests(),
      })
      void queryClient.invalidateQueries({
        queryKey: SAAS_QUERY_KEYS.overview(),
      })
    },
    onError: (error) => {
      void message.error(error.message)
    },
  })
}

export function useCancelSaasPaymentOrder() {
  const { message } = App.useApp()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => cancelSaasPaymentOrder(id),
    onSuccess: (res) => {
      void message.success(res.message || 'Đã hủy đơn thanh toán')
      void queryClient.invalidateQueries({
        queryKey: SAAS_QUERY_KEYS.paymentsSummary(),
      })
      void queryClient.invalidateQueries({
        queryKey: SAAS_QUERY_KEYS.paymentOrders(),
      })
      void queryClient.invalidateQueries({
        queryKey: SAAS_QUERY_KEYS.overview(),
      })
    },
    onError: (error) => {
      void message.error(error.message)
    },
  })
}

export function useReconcileSaasPaymentOrder() {
  const { message } = App.useApp()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => reconcileSaasPaymentOrder(id),
    onSuccess: (res) => {
      const result = res.data
      if (result.matched) {
        void message.success(
          `Đối soát khớp đơn ${result.order.paymentCode} và đã kích hoạt gói!`,
        )
      } else {
        void message.info(
          `Chưa thấy giao dịch khớp cho đơn ${result.order.paymentCode} (đã kiểm tra ${result.checkedTransactions} giao dịch)`,
        )
      }
      void queryClient.invalidateQueries({
        queryKey: SAAS_QUERY_KEYS.paymentsSummary(),
      })
      void queryClient.invalidateQueries({
        queryKey: SAAS_QUERY_KEYS.paymentOrders(),
      })
      void queryClient.invalidateQueries({
        queryKey: SAAS_QUERY_KEYS.paymentEvents(),
      })
      void queryClient.invalidateQueries({
        queryKey: SAAS_QUERY_KEYS.tenants(),
      })
      void queryClient.invalidateQueries({
        queryKey: SAAS_QUERY_KEYS.overview(),
      })
    },
    onError: (error) => {
      void message.error(error.message)
    },
  })
}

export function useRunSaasPaymentsReconcile() {
  const { message } = App.useApp()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => runSaasPaymentsReconcile(),
    onSuccess: (res) => {
      const r = res.data
      void message.success(
        `Đối soát SePay hoàn tất: tải ${r.fetched} giao dịch, khớp ${r.matched}, chưa khớp ${r.unmatched}, đã xử lý ${r.alreadyHandled}`,
      )
      void queryClient.invalidateQueries({
        queryKey: SAAS_QUERY_KEYS.paymentsSummary(),
      })
      void queryClient.invalidateQueries({
        queryKey: SAAS_QUERY_KEYS.paymentOrders(),
      })
      void queryClient.invalidateQueries({
        queryKey: SAAS_QUERY_KEYS.paymentEvents(),
      })
      void queryClient.invalidateQueries({
        queryKey: SAAS_QUERY_KEYS.tenants(),
      })
      void queryClient.invalidateQueries({
        queryKey: SAAS_QUERY_KEYS.overview(),
      })
    },
    onError: (error) => {
      void message.error(error.message)
    },
  })
}
