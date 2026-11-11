export interface PaginationQueryDTO {
    page?: number
    limit?: number
    search?: string
    sortBy?: string
    sortOrder?: "asc" | "desc"
}