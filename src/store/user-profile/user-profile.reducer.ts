import { createSlice } from '@reduxjs/toolkit';
import { AnyAction } from 'redux';
import { toggleUserDropdown } from './user-profile.action';

export type UserProfileState = {
  readonly isUserDropdownOpen: boolean;
};

export const USER_PROFILE_INITIAL_STATE: UserProfileState = {
  isUserDropdownOpen: false,
};

// const userProfileSlice = createSlice({

// });

export const userProfileReducer = (
  state = USER_PROFILE_INITIAL_STATE,
  action: AnyAction
): UserProfileState => {
  if (toggleUserDropdown.match(action)) {
    return { ...state, isUserDropdownOpen: action.payload };
  }

  return state;
};
