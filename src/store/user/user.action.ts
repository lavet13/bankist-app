import { User } from 'firebase/auth';
import {
  AdditionalInformation,
  UserData,
} from '../../utils/firebase/firebase.types';
import {
  Action,
  ActionWithPayload,
  createAction,
  withMatcher,
} from '../../utils/reducer/reducer.utils';
import {
  CloseAccountStartPayload,
  EmailSignInStartPayload,
  SignUpStartPayload,
  SignUpSuccessPayload,
  USER_ACTION_TYPES,
} from './user.types';

export type CheckUserSession = Action<USER_ACTION_TYPES.CHECK_USER_SESSION>;

export type EmailSignInStart = ActionWithPayload<
  USER_ACTION_TYPES.EMAIL_SIGN_IN_START,
  EmailSignInStartPayload
>;

export type GoogleSignInStart = Action<USER_ACTION_TYPES.GOOGLE_SIGN_IN_START>;

export type SignUpStart = ActionWithPayload<
  USER_ACTION_TYPES.SIGN_UP_START,
  SignUpStartPayload
>;

export type SignOutStart = Action<USER_ACTION_TYPES.SIGN_OUT_START>;

export type CloseAccountStart = ActionWithPayload<
  USER_ACTION_TYPES.CLOSE_ACCOUNT_START,
  CloseAccountStartPayload
>;

export type SignInSuccess = ActionWithPayload<
  USER_ACTION_TYPES.SIGN_IN_SUCCESS,
  UserData | null
>;

export type SignUpSuccess = ActionWithPayload<
  USER_ACTION_TYPES.SIGN_UP_SUCCESS,
  SignUpSuccessPayload
>;

export type SignOutSuccess = Action<USER_ACTION_TYPES.SIGN_OUT_SUCCESS>;

export type CloseAccountSuccess =
  Action<USER_ACTION_TYPES.CLOSE_ACCOUNT_SUCCESS>;

export type SignUpFailed = ActionWithPayload<
  USER_ACTION_TYPES.SIGN_UP_FAILED,
  Error
>;

export type SignInFailed = ActionWithPayload<
  USER_ACTION_TYPES.SIGN_IN_FAILED,
  Error
>;

export type SignOutFailed = ActionWithPayload<
  USER_ACTION_TYPES.SIGN_OUT_FAILED,
  Error
>;

export type CloseAccountFailed = ActionWithPayload<
  USER_ACTION_TYPES.CLOSE_ACCOUNT_FAILED,
  Error
>;

export type CloseSignInErrorMessage =
  Action<USER_ACTION_TYPES.CLOSE_SIGN_IN_ERROR_MESSAGE>;

export type CloseSignUpErrorMessage =
  Action<USER_ACTION_TYPES.CLOSE_SIGN_UP_ERROR_MESSAGE>;

export type CloseCloseAccountErrorMessage =
  Action<USER_ACTION_TYPES.CLOSE_CLOSE_ACOUNT_ERROR_MESSAGE>;

export type ResetErrors = Action<USER_ACTION_TYPES.RESET_USER_ERRORS>;

export type ResetUserLoading = Action<USER_ACTION_TYPES.RESET_USER_LOADING>;

export const checkUserSession = withMatcher(
  (): CheckUserSession => createAction(USER_ACTION_TYPES.CHECK_USER_SESSION)
);

export const emailSignInStart = withMatcher(
  (email: string, password: string): EmailSignInStart =>
    createAction(USER_ACTION_TYPES.EMAIL_SIGN_IN_START, {
      email,
      password,
    })
);

export const googleSignInStart = withMatcher(
  (): GoogleSignInStart => createAction(USER_ACTION_TYPES.GOOGLE_SIGN_IN_START)
);

export const signUpStart = withMatcher(
  (userData: SignUpStartPayload): SignUpStart =>
    createAction(USER_ACTION_TYPES.SIGN_UP_START, userData)
);

export const signOutStart = withMatcher(
  (): SignOutStart => createAction(USER_ACTION_TYPES.SIGN_OUT_START)
);

export const closeAccountStart = withMatcher(
  (userData: CloseAccountStartPayload): CloseAccountStart =>
    createAction(USER_ACTION_TYPES.CLOSE_ACCOUNT_START, userData)
);

export const signInSuccess = withMatcher(
  (user: UserData | null): SignInSuccess =>
    createAction(USER_ACTION_TYPES.SIGN_IN_SUCCESS, user)
);

export const signUpSuccess = withMatcher(
  (user: User, additionalDetails: AdditionalInformation): SignUpSuccess =>
    createAction(USER_ACTION_TYPES.SIGN_UP_SUCCESS, {
      user,
      ...additionalDetails,
    })
);

export const signOutSuccess = withMatcher(
  (): SignOutSuccess => createAction(USER_ACTION_TYPES.SIGN_OUT_SUCCESS)
);

export const closeAccountSuccess = withMatcher(
  (): CloseAccountSuccess =>
    createAction(USER_ACTION_TYPES.CLOSE_ACCOUNT_SUCCESS)
);

export const signUpFailed = withMatcher(
  (error: Error): SignUpFailed =>
    createAction(USER_ACTION_TYPES.SIGN_UP_FAILED, error)
);

export const signInFailed = withMatcher(
  (error: Error): SignInFailed =>
    createAction(USER_ACTION_TYPES.SIGN_IN_FAILED, error)
);

export const signOutFailed = withMatcher(
  (error: Error): SignOutFailed =>
    createAction(USER_ACTION_TYPES.SIGN_OUT_FAILED, error)
);

export const closeAccountFailed = withMatcher(
  (error: Error): CloseAccountFailed =>
    createAction(USER_ACTION_TYPES.CLOSE_ACCOUNT_FAILED, error)
);

export const closeSignInErrorMessage = withMatcher(
  (): CloseSignInErrorMessage =>
    createAction(USER_ACTION_TYPES.CLOSE_SIGN_IN_ERROR_MESSAGE)
);

export const closeSignUpErrorMessage = withMatcher(
  (): CloseSignUpErrorMessage =>
    createAction(USER_ACTION_TYPES.CLOSE_SIGN_UP_ERROR_MESSAGE)
);

export const closeCloseAccountErrorMessage = withMatcher(
  (): CloseCloseAccountErrorMessage =>
    createAction(USER_ACTION_TYPES.CLOSE_CLOSE_ACOUNT_ERROR_MESSAGE)
);

export const resetErrors = withMatcher(
  (): ResetErrors => createAction(USER_ACTION_TYPES.RESET_USER_ERRORS)
);

export const resetUserLoading = withMatcher(
  (): ResetUserLoading => createAction(USER_ACTION_TYPES.RESET_USER_LOADING)
);
