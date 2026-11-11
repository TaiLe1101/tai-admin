import { store } from '#/app/store/store'
import LoginPage from '#/features/auth/pages/LoginPage/LoginPage'
import { refreshToken } from '#/shared/api/axiosClient';
import { PageLoading } from '#/shared/components';
import { ROUTE } from '#/shared/constants/route';
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth-layout/auth/login/')({
  beforeLoad: async () => {
    // Nếu chưa có token trong RAM, thử kiểm tra cookie
    if (!store.getState().auth.accessToken) {
      try {
        await refreshToken()
      } catch {
        // Chưa đăng nhập, ở lại trang login bình thường
      }
    }
    const state = store.getState()
    if (state.auth.isAuthenticated) {
      throw redirect({
        to: ROUTE.DASHBOARD,
      })
    }
  },
  pendingComponent: () => (
    <PageLoading fullScreen tip="Đang kiểm tra đăng nhập..." />
  ),
  component: LoginPage,
})

