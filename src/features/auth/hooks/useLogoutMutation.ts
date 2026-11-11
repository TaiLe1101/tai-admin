import { useAppDispatch } from '#/app/store/hooks'
import { logoutApi } from '#/features/auth/api/authApi'
import { logout } from '#/features/auth/slices/authSlice'
import { removePermissions } from '#/features/auth/slices/permissionSlice'
import { removeProfile } from '#/features/auth/slices/profileSlice'
import { removeRoles } from '#/features/auth/slices/roleSlice'
import { ROUTE } from '#/shared/constants/route'
import type { ApiResponse } from '#/shared/types/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { App } from 'antd'

export function useLogoutMutation() {
    const { message } = App.useApp()
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const queryClient = useQueryClient()

    return useMutation<ApiResponse<null>, Error>({
        mutationFn: () => logoutApi(),
        onSuccess: async (res) => {
            dispatch(logout())
            dispatch(removeProfile())
            dispatch(removeRoles())
            dispatch(removePermissions())
            queryClient.clear()
            message.success(res.message)
            navigate({ to: ROUTE.DASHBOARD })
        },
        onError: (error) => {
            message.error(error.message)
        },
    })
}

export default useLogoutMutation
