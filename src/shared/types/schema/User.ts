import type { BaseSchema } from "#/shared/types/schema/BaseSchema";
import type { Department } from "#/shared/types/schema/Department";
import type { Gender } from "#/shared/types/schema/Gender";
import type { Position } from "#/shared/types/schema/Position";
import type { UserRole } from "#/shared/types/schema/UserRole";

export interface User extends BaseSchema {
    isRoot: boolean
    username: string
    avatar: string
    firstName: string
    lastName: string
    phoneNumber?: string
    dateOfBirth?: Date

    departmentId?: number
    department?: Department

    positionId?: number
    position?: Position

    genderId: number
    gender?: Gender

    userRoles?: UserRole[]
}