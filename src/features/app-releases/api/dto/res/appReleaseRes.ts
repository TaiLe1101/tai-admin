import type { ApiResponse } from '#/shared/types/api'

export interface AppRelease {
  id: number
  version: string
  createdAt: string
  updatedAt: string
  publishedAt: string | null
  installerName: string
  installerSize: number
  installerSha512: string
  blockmapSize: number
  blockmapSha512: string
  status: 'draft' | 'published'
  isCurrent: boolean
  files: { manifest: string; installer: string; blockmap: string }
}

export interface AppReleaseListRes extends ApiResponse<AppRelease[]> {
  pagination: {
    page: number
    limit: number
    totalPage: number
    totalItems: number
  }
}
