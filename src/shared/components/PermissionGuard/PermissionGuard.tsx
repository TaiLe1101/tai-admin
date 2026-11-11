import { useAppSelector } from '#/app/store/hooks'
import type { PermissionCode } from '#/shared/constants/permissions'
import { useHasPermission } from '#/shared/hooks/useHasPermission/useHasPermission'
import type { ReactNode } from 'react'

export interface PermissionGuardProps {
  permission: PermissionCode
  fallback?: ReactNode
  children: ReactNode
}

/**
 * Component kiểm soát quyền truy cập phần tử UI
 * - Tự động bypass cho tài khoản có vai trò ROOT hoặc DEV
 * - Nếu có quyền: render children
 * - Nếu không có quyền: render fallback (mặc định null - ẩn hoàn toàn)
 */
export function PermissionGuard({
  permission,
  fallback = null,
  children,
}: PermissionGuardProps) {
  const { roles } = useAppSelector(state => state.roles)
  const { hasPermission } = useHasPermission()

  roles.forEach(r => {
    if (r.code === "ROOT" || r.code === "DEV") return <>{children}</>
  })

  const isAllowed = hasPermission(permission)

  return isAllowed ? <>{children}</> : <>{fallback}</>
}

export default PermissionGuard
