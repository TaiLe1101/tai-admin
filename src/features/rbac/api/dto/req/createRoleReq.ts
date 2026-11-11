export interface CreateRoleReq {
  code: string
  name: string
  description?: string
  userIds?: number[]
  permissionIds: number[]
}

