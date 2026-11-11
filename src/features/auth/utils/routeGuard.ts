import { queryClient } from '#/app/providers/QueryProvider'
import { fetchMe, GET_ME_QUERY_KEY } from '#/features/auth/queries/useGetMeQuery'
import { hasPermission } from '#/features/auth/utils/permission'
import type { PermissionCode } from '#/shared/constants/permissions'
import { isRedirect, redirect } from '@tanstack/react-router'

/**
 * Route guard helper cho beforeLoad của TanStack Router
 * - Lấy thông tin user hiện tại từ queryClient cache hoặc fetchMe
 * - Kiểm tra quyền hạn của user
 * - Nếu không có quyền -> Chuyển hướng sang /403
 */
export async function requirePermission(permission: PermissionCode) {
  try {
    const me = await queryClient.ensureQueryData({
      queryKey: GET_ME_QUERY_KEY,
      queryFn: fetchMe,
      staleTime: 5 * 60 * 1000,
    })

    if (!hasPermission(me, permission)) {
      throw redirect({ to: '/403' })
    }
  } catch (error) {
    if (isRedirect(error)) {
      throw error
    }
    throw redirect({ to: '/403' })
  }
}
