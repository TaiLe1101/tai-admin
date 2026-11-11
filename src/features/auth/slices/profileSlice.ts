import type { User } from '#/shared/types/schema/User';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface ProfileState {
    profile: User | null
}

const initialState: ProfileState = {
    profile: null
};

export const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        setProfile: (state, action: PayloadAction<{ profile: User }>) => {
            state.profile = action.payload.profile;
        },
        removeProfile: (state) => {
            state.profile = null
        },
    },
});

export const { setProfile, removeProfile } = profileSlice.actions;

// Export reducer ở đây:
export default profileSlice.reducer;