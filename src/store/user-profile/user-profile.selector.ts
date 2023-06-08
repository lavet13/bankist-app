import { createSelector } from 'reselect';
import { RootState } from '../store';

export const selectUserProfileReducer = (state: RootState) => state.userProfile;

export const selectUserDropdownIsOpen = createSelector(
  selectUserProfileReducer,
  userProfile => userProfile.isUserDropdownOpen
);
