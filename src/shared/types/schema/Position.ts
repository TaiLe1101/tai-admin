import type { BaseSchema } from "#/shared/types/schema/BaseSchema";
import type { User } from "#/shared/types/schema/User";

export interface Position extends BaseSchema {
    code: string
    name: string

    users?: User[]
}