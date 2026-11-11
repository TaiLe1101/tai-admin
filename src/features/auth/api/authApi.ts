import type {
  ReqLogin,
  ResLogin,
  ResMe
} from '#/features/auth/types'
import { axiosClient } from '#/shared/api/axiosClient'
import type { ApiResponse } from '#/shared/types/api'

export const loginApi = async (
  data: ReqLogin,
): Promise<ApiResponse<ResLogin>> => {
  return axiosClient.post('/auth/web/login', data)
}

export const logoutApi = async (): Promise<ApiResponse<null>> => {
  return axiosClient.post('/auth/logout')
}

export const getMeApi = async (): Promise<ApiResponse<ResMe>> => {
  return axiosClient.get('/auth/me')
}

