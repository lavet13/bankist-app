import { createSelector } from 'reselect';
import { RootState } from '../../app/store';

export const selectUserReducer = (state: RootState) => state.user;

export const selectCurrentUser = createSelector(
  selectUserReducer,
  user => user.currentUser
);

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

export const selectCloseAccountIsLoading = createSelector(
  [selectUserReducer],
  user => user.closeAccountIsLoading
);

export const selectSignInError = createSelector(
  [selectUserReducer],
  user => user.signInError
);

export const selectSignUpError = createSelector(
  [selectUserReducer],
  user => user.signUpError
);

export const selectCloseAccountError = createSelector(
  [selectUserReducer],
  user => user.closeAccountError
);

export const selectSignOutError = createSelector(
  [selectUserReducer],
  user => user.signOutError
);
