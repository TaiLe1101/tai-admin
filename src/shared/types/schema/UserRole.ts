import type { BaseSchema } from "#/shared/types/schema/BaseSchema";
import type { Role } from "#/shared/types/schema/Role";
import type { User } from "#/shared/types/schema/User";

export interface UserRole extends BaseSchema {
    userId: number
    roleId: number

    user?: User
    role?: Role
}