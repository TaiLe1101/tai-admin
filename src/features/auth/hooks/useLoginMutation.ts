import { useAppDispatch } from '#/app/store/hooks'
import { loginApi } from '#/features/auth/api/authApi'
import { fetchMe, GET_ME_QUERY_KEY } from '#/features/auth/queries/useGetMeQuery'
import { setCredentials } from '#/features/auth/slices/authSlice'
import { setPermissions } from '#/features/auth/slices/permissionSlice'
import { setProfile } from '#/features/auth/slices/profileSlice'
import { setRoles } from '#/features/auth/slices/roleSlice'
import type { ReqLogin, ResLogin } from '#/features/auth/types'
import { ROUTE } from '#/shared/constants/route'
import type { ApiResponse } from '#/shared/types/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { App } from 'antd'

export function useLoginMutation() {
  const { message } = App.useApp()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const dispatch = useAppDispatch()

  return useMutation<ApiResponse<ResLogin>, Error, ReqLogin>({
    mutationFn: (credentials: ReqLogin) => loginApi(credentials),
    onSuccess: async (res) => {
      if (res.data?.accessToken) {
        dispatch(setCredentials({ accessToken: res.data.accessToken }))

        try {
          const resMe = await queryClient.fetchQuery({
            queryKey: GET_ME_QUERY_KEY,
            queryFn: fetchMe,
          })

          dispatch(setProfile({ profile: resMe.profile }))
          dispatch(setRoles({ roles: resMe.roles }))
          dispatch(setPermissions({ permissions: resMe.permissions }))
        } catch (meError) {
          console.warn('Lỗi khi tải thông tin người dùng sau khi đăng nhập:', meError)
        }
      }

      message.success(res.message)
      navigate({ to: ROUTE.DASHBOARD })
    },
    onError: (error) => {
      message.error(error.message)
    },
  })
}

export default useLoginMutation
