import type { ResMe } from '#/features/auth/types'
import type { PermissionCode } from '#/shared/constants/permissions'

/**
 * Kiểm tra xem người dùng hiện tại có quyền thực hiện thao tác hay không
 * Chỉ bypass toàn bộ quyền cho vai trò ROOT và DEV
 */
export function hasPermission(
  me: ResMe | null | undefined,
  requiredPermission: PermissionCode | string,
): boolean {
  if (!me) return false

  if (!me.profile?.isActive) return false

  if (me.profile?.isRoot) return true

  if (me.roles?.some((role) => role.name === 'ROOT' || role.name === 'DEV')) {
    return true
  }

  return (
    me.permissions?.some((perm) => perm.code === requiredPermission) ?? false
  )
}

/**
 * Kiểm tra xem người dùng có ít nhất một trong các quyền được yêu cầu hay không
 * Chỉ bypass toàn bộ quyền cho vai trò ROOT và DEV
 */
export function hasAnyPermission(
  me: ResMe | null | undefined,
  requiredPermissions: (PermissionCode | string)[],
): boolean {
  if (!me) return false

  if (!me.profile?.isActive) return false

  if (me.profile?.isRoot) return true

  if (me.roles?.some((role) => role.name === 'ROOT' || role.name === 'DEV')) {
    return true
  }

  const permissionCodes = new Set(me.permissions?.map((p) => p.code) || [])
  return requiredPermissions.some((perm) => permissionCodes.has(perm))
}
