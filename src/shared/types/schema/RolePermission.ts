import type { Permission } from './Permission'
import type { Role } from './Role'

export interface RolePermission {
  roleId: number
  permissionId: number

  role?: Role
  permission?: Permission
}
