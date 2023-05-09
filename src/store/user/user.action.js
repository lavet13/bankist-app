import { createAction } from '../../utils/reducer/reducer.utils';
import { USER_ACTION_TYPES } from './user.types';

export const checkUserSession = () =>
  createAction(USER_ACTION_TYPES.CHECK_USER_SESSION);

export const emailSignInStart = (email, password, navigateToWorkPage) =>
  createAction(USER_ACTION_TYPES.EMAIL_SIGN_IN_START, {
    email,
    password,
    navigateToWorkPage,
  });

export const googleSignInStart = navigateToWorkPage =>
  createAction(USER_ACTION_TYPES.GOOGLE_SIGN_IN_START, navigateToWorkPage);

export const signInSuccess = user =>
  createAction(USER_ACTION_TYPES.SIGN_IN_SUCCESS, user);

export const signInFailed = error =>
  createAction(USER_ACTION_TYPES.SIGN_IN_FAILED, error);

export const signUpStart = userData =>
  createAction(USER_ACTION_TYPES.SIGN_UP_START, userData);

export const signUpSuccess = (user, additionalDetails, navigateToWork) =>
  createAction(USER_ACTION_TYPES.SIGN_UP_SUCCESS, {
    user,
    navigateToWork,
    ...additionalDetails,
  });

export const signUpFailed = error =>
  createAction(USER_ACTION_TYPES.SIGN_UP_FAILED, error);

export const signOutStart = () =>
  createAction(USER_ACTION_TYPES.SIGN_OUT_START);

export const signOutSuccess = () =>
  createAction(USER_ACTION_TYPES.SIGN_OUT_SUCCESS);

export const signOutFailed = error =>
  createAction(USER_ACTION_TYPES.SIGN_OUT_FAILED, error);
