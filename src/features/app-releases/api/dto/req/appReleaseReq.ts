export interface AppReleaseQuery {
  page: number
  limit: number
  q?: string
  status?: 'draft' | 'published'
  sortBy: 'id' | 'version' | 'createdAt' | 'publishedAt'
  sortOrder: 'asc' | 'desc'
}

export interface UploadAppReleaseReq {
  manifest: File
  installer: File
  blockmap: File
}
