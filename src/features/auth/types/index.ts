import type { Permission } from '#/shared/types/schema/Permission'
import type { Role } from '#/shared/types/schema/Role'
import type { User } from '#/shared/types/schema/User'

export interface ReqLogin {
  username: string
  password: string
}

export interface ResLogin {
  accessToken: string
}

export interface ResRefreshToken extends ResLogin { }

export interface ResMe {
  profile: User
  roles: Role[]
  permissions: Permission[]
}

export * from '#/features/auth/api/dto/res/getMeRes'
