import { createRoleApi } from '#/features/rbac/api/rbacApi'
import type { CreateRoleReq } from '#/features/rbac/api/dto/req/createRoleReq'
import type { CreateRoleRes } from '#/features/rbac/api/dto/res/createRoleRes'
import { GET_ROLES_QUERY_KEY } from '#/features/rbac/queries/useGetRoles'
import type { ApiResponse } from '#/shared/types/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { App } from 'antd'

export function useCreateRole() {
  const { message } = App.useApp()
  const queryClient = useQueryClient()

  return useMutation<ApiResponse<CreateRoleRes>, Error, CreateRoleReq>({
    mutationFn: (data: CreateRoleReq) => createRoleApi(data),
    onSuccess: (res) => {
      message.success(res.message || 'Thêm vai trò mới thành công')
      queryClient.invalidateQueries({ queryKey: GET_ROLES_QUERY_KEY })
    },
    onError: (error) => {
      message.error(error.message)
    },
  })
}

export default useCreateRole

