import type { UserRole } from '#/shared/types/schema/UserRole'
import type { BaseSchema } from './BaseSchema'
import type { RolePermission } from './RolePermission'

export interface Role extends BaseSchema {
  code: string
  name: string
  description?: string
  
  rolePermissions?: RolePermission[]
  userRoles?: UserRole[]
}
