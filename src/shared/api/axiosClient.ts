import { store } from '#/app/store/store'
import { logout, setCredentials } from '#/features/auth/slices/authSlice'
import type { ResRefreshToken } from '#/features/auth/types'
import axiosJwt from '#/shared/api/axiosJwt'
import { ROUTE } from '#/shared/constants/route'
import type { ApiResponse } from '#/shared/types/api'
import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import axios from 'axios'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL

let refreshPromise: Promise<string> | null = null

export const axiosClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
})

axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const state = store.getState();
    const token = state.auth.accessToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

axiosClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data
  },
  async (error) => {
    const resData = error.response?.data
    const serverMessage = resData?.message || error.message || 'Lỗi kết nối máy chủ'
    const formattedMessage = Array.isArray(serverMessage)
      ? serverMessage.join(', ')
      : serverMessage

    const customError = new Error(formattedMessage)
      ; (customError as any).statusCode = error.response?.status
      ; (customError as any).response = error.response
      ; (customError as any).data = resData

    // Nếu mã lỗi 401 và không phải đang gọi API đăng nhập, thì refreshToken
    if (error.response?.status === 401) {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };
      if (!originalRequest) throw error;

      const isLoginRequest = error.config?.url?.includes('/auth/web/login');
      const isRefreshCall = originalRequest.url?.includes("/auth/web/refresh");
      if (!originalRequest._retry && !isLoginRequest && !isRefreshCall) {
        originalRequest._retry = true;

        try {
          const newAccessToken = await refreshToken()
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`

          return axiosClient(originalRequest)
        } catch (refreshErr) {
          store.dispatch(logout())
          if (typeof window !== 'undefined' && !window.location.pathname.includes('/auth/login')) {
            window.location.href = ROUTE.AUTH.LOGIN
          }
          return Promise.reject(refreshErr)
        }
      }
    }

    return Promise.reject(customError)
  },
)

export const refreshToken = async (): Promise<string> => {

  if (refreshPromise) {
    return refreshPromise
  }

  refreshPromise = (async () => {
    try {
      const response: ApiResponse<ResRefreshToken> = await axiosJwt.post('/auth/web/refresh')
      const newAccessToken = response.data?.accessToken
      if (!newAccessToken) {
        throw new Error('Không lấy được access token mới từ máy chủ')
      }
      store.dispatch(setCredentials({ accessToken: newAccessToken }))
      return newAccessToken
    } finally {
      refreshPromise = null
    }
  })()

  return refreshPromise
};

export default axiosClient
