import { createAction } from '../../utils/reducer/reducer.utils';
import { USER_ACTION_TYPES } from './user.types';

export const checkUserSession = () =>
  createAction(USER_ACTION_TYPES.CHECK_USER_SESSION);

export const emailSignInStart = (email, password) =>
  createAction(USER_ACTION_TYPES.EMAIL_SIGN_IN_START, {
    email,
    password,
  });

export const googleSignInStart = () =>
  createAction(USER_ACTION_TYPES.GOOGLE_SIGN_IN_START);

export const signUpStart = userData =>
  createAction(USER_ACTION_TYPES.SIGN_UP_START, userData);

export const signOutStart = () =>
  createAction(USER_ACTION_TYPES.SIGN_OUT_START);

export const signInSuccess = user =>
  createAction(USER_ACTION_TYPES.SIGN_IN_SUCCESS, user);

export const signUpSuccess = (user, additionalDetails) =>
  createAction(USER_ACTION_TYPES.SIGN_UP_SUCCESS, {
    user,
    ...additionalDetails,
  });

export const signOutSuccess = () =>
  createAction(USER_ACTION_TYPES.SIGN_OUT_SUCCESS);

export const signUpFailed = error =>
  createAction(USER_ACTION_TYPES.SIGN_UP_FAILED, error);

export const signInFailed = error =>
  createAction(USER_ACTION_TYPES.SIGN_IN_FAILED, error);

export const signOutFailed = error =>
  createAction(USER_ACTION_TYPES.SIGN_OUT_FAILED, error);

export const closeErrorMessage = () =>
  createAction(USER_ACTION_TYPES.CLOSE_ERROR_MESSAGE);
