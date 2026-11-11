import type { PermissionGroup } from '#/shared/types/schema/PermissionGroup'
import type { BaseSchema } from './BaseSchema'
import type { RolePermission } from './RolePermission'

export interface Permission extends BaseSchema {
  code: string
  name: string
  description?: string
  permissionGroupId: number
  
  permissionGroup?: PermissionGroup
  rolePermissions?: RolePermission[]
}
