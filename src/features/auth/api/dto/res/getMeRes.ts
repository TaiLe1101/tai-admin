import type { ApiResponse } from '#/shared/types/api'

export interface RoleInfo {
  id: number
  name: string
  description: string | null
}

export interface PermissionItem {
  id: number
  code: string
  name: string
  description: string | null
  group: string
}

export interface MeSystemUserRes {
  id: number
  firstName: string
  lastName: string
  accountId: number
}

export interface MeHospitalEmployeeRes {
  id: number
  firstName: string
  lastName: string
  accountId: number
  code?: string | null
  departmentId?: number | null
}

export interface MePatientVisitEmployeeRes {
  id: number
  firstName: string
  lastName: string
  accountId: number
  code?: string | null
}

export interface MeAccountRes {
  id: number
  username: string
  email: string
  avatar: string | null
  status: 'ACTIVE' | 'INACTIVE'
  type: 'SYSTEM_USER' | 'HOSPITAL_EMPLOYEE' | 'PATIENT_VISIT_EMPLOYEE'
  roleId?: number | null
  role?: RoleInfo | null
}

export interface MeData {
  id: number
  username: string
  email: string
  avatar: string | null
  status: 'ACTIVE' | 'INACTIVE'
  type: 'SYSTEM_USER' | 'HOSPITAL_EMPLOYEE' | 'PATIENT_VISIT_EMPLOYEE'
  firstName?: string
  lastName?: string
  fullName?: string
  phoneNumber?: string | null
  code?: string | null
  roleId?: number | null
  role?: RoleInfo | null
  permissions: string[]
  permissionDetails?: PermissionItem[]
  systemUser?: MeSystemUserRes | null
  hospitalEmployee?: MeHospitalEmployeeRes | null
  patientVisitEmployee?: MePatientVisitEmployeeRes | null
  account?: MeAccountRes | null
  createdAt: string
  updatedAt: string
}

export type GetMeRes = ApiResponse<MeData>
