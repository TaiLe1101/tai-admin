import { LoginStatus } from '#/shared/types/enum'

export { LoginStatus }

export interface UserLoginLog {
  id: number
  createdAt: Date
  updatedAt: Date

  username?: string
  ipAddress: string
  userAgent?: string
  device?: string
  status: LoginStatus
  failureReason?: string
}
