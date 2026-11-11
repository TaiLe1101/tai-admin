import { configureStore } from '@reduxjs/toolkit';

import authReducer from "#/features/auth/slices/authSlice";
import permissionReducer from "#/features/auth/slices/permissionSlice";
import roleReducer from "#/features/auth/slices/roleSlice";
import profileReducer from "#/features/auth/slices/profileSlice"


export const store = configureStore({
    reducer: {
        auth: authReducer,
        profile: profileReducer,
        permissions: permissionReducer,
        roles: roleReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;