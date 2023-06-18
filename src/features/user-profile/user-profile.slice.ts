import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export type UserProfileState = {
  readonly isUserDropdownOpen: boolean;
};

const initialState: UserProfileState = {
  isUserDropdownOpen: false,
};

export const userProfileSlice = createSlice({
  name: 'userProfile',
  initialState,
  reducers: {
    userProfileToggled(state, action: PayloadAction<boolean>) {
      state.isUserDropdownOpen = action.payload;
    },
  },
});

export const { userProfileToggled } = userProfileSlice.actions;
export default userProfileSlice.reducer;
