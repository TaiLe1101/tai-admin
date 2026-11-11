export interface ApiResponse<T = any> {
  statusCode: number
  status: string
  message: string
  data: T
  pagination?: any
  meta?: any
}

export interface ApiErrorResponse {
  statusCode: number
  status: string
  message: string
  data?: null
}
