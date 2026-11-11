import axiosClient from '#/shared/api/axiosClient'
import type { ApiResponse } from '#/shared/types/api'
import type { PaginationQueryDTO } from '#/shared/types/pagination-query-dto'
import type { Role } from '#/shared/types/schema/Role'
import type { CreateRoleReq } from './dto/req/createRoleReq'
import type { CreateRoleRes } from './dto/res/createRoleRes'
import type { GetPermissionsRes } from './dto/res/getPermissionsRes'

const ENDPOINT = '/rbac'

export const getRoles = (params?: PaginationQueryDTO): Promise<ApiResponse<Role[]>> => {
  return axiosClient.get(`${ENDPOINT}/roles`, {
    params,
  })
}

export const createRoleApi = (data: CreateRoleReq): Promise<ApiResponse<CreateRoleRes>> => {
  return axiosClient.post(`${ENDPOINT}/roles`, data)
}

export const getPermissionsApi = (): Promise<ApiResponse<GetPermissionsRes>> => {
  return axiosClient.get(`${ENDPOINT}/permissions`)
}
