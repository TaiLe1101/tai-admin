import type { BaseSchema } from "#/shared/types/schema/BaseSchema";
import type { Permission } from "#/shared/types/schema/Permission";

export interface PermissionGroup extends BaseSchema {
    code: string
    name: string
    description: string
    
    permissions?: Permission[]
}