import { AnyAction } from 'redux';
import { UserData } from '../../utils/firebase/firebase.types';
import {
  checkUserSession,
  closeAccountFailed,
  closeAccountStart,
  closeCloseAccountErrorMessage,
  closeSignInErrorMessage,
  closeSignUpErrorMessage,
  emailSignInStart,
  googleSignInStart,
  resetErrors,
  resetUserLoading,
  signInFailed,
  signInSuccess,
  signOutFailed,
  signOutStart,
  signOutSuccess,
  signUpFailed,
  signUpStart,
} from './user.action';
import { GenerateError } from '../../utils/error/error.utils';
import { AuthError } from 'firebase/auth';

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

export const USER_INITIAL_STATE: UserState = {
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

export const userReducer = (
  state = USER_INITIAL_STATE,
  action: AnyAction
): UserState => {
  if (emailSignInStart.match(action)) {
    return { ...state, emailSignInIsLoading: true };
  }

  if (googleSignInStart.match(action)) {
    return { ...state, googleSignInIsLoading: true };
  }

  if (signUpStart.match(action)) {
    return { ...state, emailSignUpIsLoading: true };
  }

  if (closeAccountStart.match(action)) {
    return { ...state, closeAccountIsLoading: true };
  }

  if (checkUserSession.match(action) || signOutStart.match(action)) {
    return { ...state, isLoading: true };
  }

  if (signInSuccess.match(action)) {
    return { ...state, currentUser: action.payload };
  }

  if (signOutSuccess.match(action)) {
    return { ...state, currentUser: null };
  }

  if (signOutFailed.match(action)) {
    return { ...state, signOutError: action.payload };
  }

  if (signUpFailed.match(action)) {
    return { ...state, signUpError: action.payload };
  }

  if (signInFailed.match(action)) {
    return { ...state, signInError: action.payload };
  }

  if (closeAccountFailed.match(action)) {
    return { ...state, closeAccountError: action.payload };
  }

  if (closeSignInErrorMessage.match(action)) {
    return { ...state, signInError: null };
  }

  if (closeSignUpErrorMessage.match(action)) {
    return { ...state, signUpError: null };
  }

  if (closeCloseAccountErrorMessage.match(action)) {
    return { ...state, closeAccountError: null };
  }

  if (resetErrors.match(action)) {
    return {
      ...state,
      signInError: null,
      signUpError: null,
      closeAccountError: null,
      signOutError: null,
    };
  }

  if (resetUserLoading.match(action)) {
    return {
      ...state,
      isLoading: false,
      emailSignInIsLoading: false,
      emailSignUpIsLoading: false,
      googleSignInIsLoading: false,
      closeAccountIsLoading: false,
    };
  }

  return state;
};
