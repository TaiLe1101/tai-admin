import type { AxiosInstance, AxiosResponse } from 'axios'
import axios from 'axios'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL


export const axiosJwt: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
})

axiosJwt.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  async (error) => {
    return Promise.reject(error)
  },
)
export default axiosJwt
