import { UserData } from '../../utils/firebase/firebase.types';
import { GenerateError } from '../../utils/error/error.utils';
import { AuthError } from 'firebase/auth';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import {
  CloseAccountStartPayload,
  EmailSignInStartPayload,
  SignUpStartPayload,
} from './user.types';

export type UserState = {
  readonly currentUser: UserData | null;
  readonly isLoading: boolean;
  readonly emailSignInIsLoading: boolean;
  readonly googleSignInIsLoading: boolean;
  readonly emailSignUpIsLoading: boolean;
  readonly closeAccountIsLoading: boolean;
  readonly signInError: GenerateError | AuthError | null;
  readonly signUpError: GenerateError | AuthError | null;
  readonly signOutError: GenerateError | AuthError | null;
  readonly closeAccountError: GenerateError | AuthError | null;
};

export const initialState: UserState = {
  currentUser: null,
  isLoading: true,
  emailSignInIsLoading: false,
  googleSignInIsLoading: false,
  emailSignUpIsLoading: false,
  closeAccountIsLoading: false,
  signInError: null,
  signUpError: null,
  signOutError: null,
  closeAccountError: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    emailSignInStarted(state, _: PayloadAction<EmailSignInStartPayload>) {
      state.emailSignInIsLoading = true;
    },

    googleSignInStarted(state, _: PayloadAction<void>) {
      state.googleSignInIsLoading = true;
    },

    signUpStarted(state, _: PayloadAction<SignUpStartPayload>) {
      state.emailSignUpIsLoading = true;
    },

    closeAccountStarted(state, _: PayloadAction<CloseAccountStartPayload>) {
      state.closeAccountIsLoading = true;
    },

    userSessionChecked(state, _: PayloadAction<void>) {
      state.isLoading = true;
    },

    signOutStarted(state, _: PayloadAction<void>) {
      state.isLoading = true;
    },

    signInSucceeded(state, action: PayloadAction<UserData | null>) {
      state.currentUser = action.payload;
    },

    signOutSucceeded(state, _: PayloadAction<void>) {
      state.currentUser = null;
    },

    signOutFailed(state, action: PayloadAction<Error>) {
      state.signOutError = action.payload;
    },

    signUpFailed(state, action: PayloadAction<Error>) {
      state.signUpError = action.payload;
    },

    signInFailed(state, action: PayloadAction<Error>) {
      state.signInError = action.payload;
    },

    closeAccountFailed(state, action: PayloadAction<Error>) {
      state.closeAccountError = action.payload;
    },

    signInErrorMessageClosed(state, _: PayloadAction<void>) {
      state.signInError = null;
    },

    signUpErrorMessageClosed(state, _: PayloadAction<void>) {
      state.signUpError = null;
    },

    closeAccountErrorMessageClosed(state, _: PayloadAction<void>) {
      state.closeAccountError = null;
    },

    userErrorsReset(state, _: PayloadAction<void>) {
      state.signInError = null;
      state.signUpError = null;
      state.closeAccountError = null;
      state.signOutError = null;
    },

    userLoadingReset(state, _: PayloadAction<void>) {
      state.isLoading = false;
      state.emailSignInIsLoading = false;
      state.emailSignUpIsLoading = false;
      state.googleSignInIsLoading = false;
      state.closeAccountIsLoading = false;
    },
  },
});

export default userSlice.reducer;
export const {
  emailSignInStarted,
  closeAccountErrorMessageClosed,
  closeAccountFailed,
  closeAccountStarted,
  googleSignInStarted,
  signInErrorMessageClosed,
  signInFailed,
  signInSucceeded,
  signOutFailed,
  signOutStarted,
  signOutSucceeded,
  signUpErrorMessageClosed,
  signUpFailed,
  signUpStarted,
  userErrorsReset,
  userLoadingReset,
  userSessionChecked,
} = userSlice.actions;
