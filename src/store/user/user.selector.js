import { createSelector } from 'reselect';

export const selectUserReducer = state => state.user;

export const selectCurrentUser = state => state.user.currentUser;

export const selectCurrentUserIsLoading = createSelector(
  [selectUserReducer],
  user => user.isLoading
);
