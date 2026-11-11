export interface PermissionItemRes {
  id: number
  code: string
  name: string
  description?: string | null
  group: string
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
}

export type GetPermissionsRes = PermissionItemRes[]

