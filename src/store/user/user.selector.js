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

export const selectSignInError = createSelector(
  [selectUserReducer],
  user => user.signInError
);

export const selectSignUpError = createSelector(
  [selectUserReducer],
  user => user.signUpError
);

export const selectCloseAccountIsLoading = createSelector(
  [selectUserReducer],
  user => user.closeAccountIsLoading
);
