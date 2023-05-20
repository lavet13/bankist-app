import { createSelector } from 'reselect';

export const selectUserReducer = state => state.user;

export const selectCurrentUser = state => state.user.currentUser;

export const selectCurrentUserIsLoading = createSelector(
  [selectUserReducer],
  user => user.isLoading
);

export const selectEmailSignInIsLoading = createSelector(
  [selectUserReducer],
  user => user.emailSignInIsLoading
);

export const selectGoogleSignInIsLoading = createSelector(
  [selectUserReducer],
  user => user.googleSignInIsLoading
);

export const selectEmailSignUpIsLoading = createSelector(
  [selectUserReducer],
  user => user.emailSignUpIsLoading
);

export const selectError = createSelector(
  [selectUserReducer],
  user => user.error
);
