import axiosClient from '#/shared/api/axiosClient'
import type { ApiResponse } from '#/shared/types/api'
import type {
  AppReleaseQuery,
  UploadAppReleaseReq,
} from './dto/req/appReleaseReq'
import type { AppRelease, AppReleaseListRes } from './dto/res/appReleaseRes'

const ENDPOINT = '/app-releases'

export const getAppReleases = (
  params: AppReleaseQuery,
): Promise<AppReleaseListRes> => axiosClient.get(ENDPOINT, { params })

export const getAppRelease = (id: number): Promise<ApiResponse<AppRelease>> =>
  axiosClient.get(`${ENDPOINT}/${id}`)

export const deleteAppRelease = (
  id: number,
): Promise<ApiResponse<AppRelease>> => axiosClient.delete(`${ENDPOINT}/${id}`)

export const uploadAppRelease = (
  files: UploadAppReleaseReq,
  onProgress: (percent: number) => void,
): Promise<ApiResponse<AppRelease>> => {
  const data = new FormData()
  data.append('manifest', files.manifest)
  data.append('installer', files.installer)
  data.append('blockmap', files.blockmap)
  return axiosClient.post(ENDPOINT, data, {
    headers: { 'Content-Type': undefined },
    timeout: 0,
    onUploadProgress: ({ loaded, total }) => {
      if (total) onProgress(Math.min(100, Math.round((loaded / total) * 100)))
    },
  })
}
