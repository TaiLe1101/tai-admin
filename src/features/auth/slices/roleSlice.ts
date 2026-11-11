import type { Role } from '#/shared/types/schema/Role';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface RoleState {
    roles: Role[] | []
}

const initialState: RoleState = {
    roles: []
};

export const roleSlice = createSlice({
    name: 'role',
    initialState,
    reducers: {
        setRoles: (state, action: PayloadAction<{ roles: Role[] }>) => {
            state.roles = action.payload.roles;
        },
        removeRoles: (state) => {
            state.roles = []
        },
    },
});

export const { setRoles, removeRoles } = roleSlice.actions;

// Export reducer ở đây:
export default roleSlice.reducer;