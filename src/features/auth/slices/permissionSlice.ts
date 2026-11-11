import type { Permission } from '#/shared/types/schema/Permission';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface PermissionState {
    permissions: Permission[] | []
}

const initialState: PermissionState = {
    permissions: []
};

export const permissionSlice = createSlice({
    name: 'permission',
    initialState,
    reducers: {
        setPermissions: (state, action: PayloadAction<{ permissions: Permission[] }>) => {
            state.permissions = action.payload.permissions;
        },
        removePermissions: (state) => {
            state.permissions = []
        },
    },
});

export const { setPermissions, removePermissions } = permissionSlice.actions;

// Export reducer ở đây:
export default permissionSlice.reducer;