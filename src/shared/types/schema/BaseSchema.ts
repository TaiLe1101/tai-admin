export interface BaseSchema {
  id: number
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
  isActive: boolean
}