import { call, all, put, takeLatest } from 'redux-saga/effects';

import { USER_ACTION_TYPES } from './user.types';
import { USER_ERROR_CODE_TYPES, USER_ERROR_MESSAGES } from './user.error';
import {
  deleteUserAccount,
  getCurrentUser,
  isAdmin,
  reauthenticateUserWithCredential,
  signInWithGooglePopup,
} from '../../utils/firebase/firebase.utils';
import { generateErrorAndErrorCode } from '../../utils/error/error.utils';

import {
  signInSuccess,
  signInFailed,
  signOutSuccess,
  signOutFailed,
  signUpFailed,
  signUpSuccess,
  closeAccountFailed,
  closeAccountSuccess,
  getProvidersInfo,
  resetErrors,
  resetUserLoading,
} from './user.action';
import {
  createUserDocumentFromAuth,
  signInAuthUserWithEmailAndPassword,
  createAuthUserWithEmailAndPassword,
  signOutUser,
} from '../../utils/firebase/firebase.utils';
import { clearLoans } from '../loan/loan.action';
import { onTimeoutInvoke } from '../../utils/timeout/timeout.utils';

export function* getSnapshotFromUserAuth(user, additionalDetails) {
  try {
    const userSnapshot = yield call(
      createUserDocumentFromAuth,
      user,
      additionalDetails
    );

    const admin = yield call(isAdmin, user);

    yield put(
      signInSuccess({ id: userSnapshot.id, ...userSnapshot.data(), ...admin })
    );
  } catch (error) {
    yield put(signInFailed(error));
  }
}

export function* isUserAuthenticated() {
  try {
    const userAuth = yield call(getCurrentUser);

    if (!userAuth) return yield put(signInSuccess(null));

    yield call(getSnapshotFromUserAuth, userAuth);
  } catch (error) {
    yield put(signInFailed(error));
  }
}

export function* signInWithEmail({ payload: { email, password } }) {
  try {
    const { INVALID_EMAIL_VALIDATION, WEAK_PASSWORD_VALIDATION } =
      USER_ERROR_CODE_TYPES;

    if (
      !email.match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
    )
      throw generateErrorAndErrorCode(
        INVALID_EMAIL_VALIDATION,
        USER_ERROR_MESSAGES[INVALID_EMAIL_VALIDATION]
      );

    if (password.length < 6)
      throw generateErrorAndErrorCode(
        WEAK_PASSWORD_VALIDATION,
        USER_ERROR_MESSAGES[WEAK_PASSWORD_VALIDATION]
      );

    const { user } = yield call(
      signInAuthUserWithEmailAndPassword,
      email,
      password
    );

    yield call(getSnapshotFromUserAuth, user);
  } catch (error) {
    yield put(signInFailed(error));
  }
}

export function* signInWithGoogle() {
  try {
    const { user } = yield call(signInWithGooglePopup);

    yield call(getSnapshotFromUserAuth, user);
  } catch (error) {
    yield put(signInFailed(error));
  }
}

export function* resetErrorsState() {
  yield put(resetErrors());
}

export function* signUpWithEmail({
  payload: { email, password, confirmPassword, ...additionalDetails },
}) {
  try {
    const {
      DISPLAY_NAME_NOT_FOUND,
      INVALID_EMAIL_VALIDATION,
      WRONG_PASSWORD,
      WEAK_PASSWORD_VALIDATION,
    } = USER_ERROR_CODE_TYPES;
    const { displayName } = additionalDetails;

    if (!displayName.length)
      throw generateErrorAndErrorCode(
        DISPLAY_NAME_NOT_FOUND,
        USER_ERROR_MESSAGES[DISPLAY_NAME_NOT_FOUND]
      );

    if (
      !email.match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
    )
      throw generateErrorAndErrorCode(
        INVALID_EMAIL_VALIDATION,
        USER_ERROR_MESSAGES[INVALID_EMAIL_VALIDATION]
      );

    if (password !== confirmPassword) {
      throw generateErrorAndErrorCode(
        WRONG_PASSWORD,
        USER_ERROR_MESSAGES[WRONG_PASSWORD]
      );
    }

    if (password.length < 6)
      throw generateErrorAndErrorCode(
        WEAK_PASSWORD_VALIDATION,
        USER_ERROR_MESSAGES[WEAK_PASSWORD_VALIDATION]
      );

    const { user } = yield call(
      createAuthUserWithEmailAndPassword,
      email,
      password
    );

    yield put(signUpSuccess(user, additionalDetails));
  } catch (error) {
    yield put(signUpFailed(error));
  }
}

export function* signInAfterSignUp({
  payload: { user, ...additionalDetails },
}) {
  yield call(getSnapshotFromUserAuth, user, additionalDetails);
}

export function* signOut() {
  try {
    yield call(signOutUser);

    yield put(signOutSuccess());
  } catch (error) {
    yield put(signOutFailed(error));
  }
}

export function* closeUserAccount({
  payload: { currentUser, resetFormFields, password = null },
}) {
  try {
    const { MISSING_PASSWORD } = USER_ERROR_CODE_TYPES;
    // @USER RE-AUTHENTICATED AND CREDENTIALS BEFORE DELETING
    // @REPEATED PROVIDER INFO

    if (password !== null) {
      if (password === '')
        throw generateErrorAndErrorCode(
          MISSING_PASSWORD,
          USER_ERROR_MESSAGES[MISSING_PASSWORD]
        );

      const providerInfo = getProvidersInfo(currentUser).map(profile =>
        profile.providerId === 'password' ? { ...profile, password } : profile
      );

      const { user } = yield call(
        reauthenticateUserWithCredential,
        providerInfo
      );
      yield call(deleteUserAccount, user);
    } else {
      const providerInfo = getProvidersInfo(currentUser);

      const { user } = yield call(
        reauthenticateUserWithCredential,
        providerInfo
      );
      yield call(deleteUserAccount, user);
    }

    yield call(resetFormFields);
    yield put(closeAccountSuccess());
  } catch (error) {
    yield put(closeAccountFailed(error));
  }
}

export function* signOutAfterDeletedUser() {
  try {
    yield call(onTimeoutInvoke, signOutUser, 2);
    yield call(resetErrorsState);

    yield put(signOutSuccess());
  } catch (error) {
    yield put(signOutFailed(error));
  }
}

export function* resetLoadingState() {
  yield put(resetUserLoading());
}

export function* clearUserLoans() {
  yield put(clearLoans());
  yield call(resetErrorsState);
}

export function* onCheckUserSession() {
  yield takeLatest(USER_ACTION_TYPES.CHECK_USER_SESSION, isUserAuthenticated);
}

export function* onEmailSignInStart() {
  yield takeLatest(USER_ACTION_TYPES.EMAIL_SIGN_IN_START, signInWithEmail);
}

export function* onGoogleSignInStart() {
  yield takeLatest(USER_ACTION_TYPES.GOOGLE_SIGN_IN_START, signInWithGoogle);
}

export function* onSignUpStart() {
  yield takeLatest(USER_ACTION_TYPES.SIGN_UP_START, signUpWithEmail);
}

export function* onSignUpSuccess() {
  yield takeLatest(USER_ACTION_TYPES.SIGN_UP_SUCCESS, signInAfterSignUp);
}

export function* onSignOutStart() {
  yield takeLatest(USER_ACTION_TYPES.SIGN_OUT_START, signOut);
}

export function* onSignOutSuccess() {
  yield takeLatest(USER_ACTION_TYPES.SIGN_OUT_SUCCESS, clearUserLoans);
}

export function* onSignOutFailed() {
  yield takeLatest(USER_ACTION_TYPES.SIGN_OUT_FAILED, resetLoadingState);
}

export function* onCloseAccountStart() {
  yield takeLatest(USER_ACTION_TYPES.CLOSE_ACCOUNT_START, closeUserAccount);
}

export function* onCloseAccountSuccess() {
  yield takeLatest(
    USER_ACTION_TYPES.CLOSE_ACCOUNT_SUCCESS,
    signOutAfterDeletedUser
  );
}

export function* onCloseAccountFailed() {
  yield takeLatest(USER_ACTION_TYPES.CLOSE_ACCOUNT_FAILED, resetLoadingState);
}

export function* onSignInSuccess() {
  yield takeLatest(USER_ACTION_TYPES.SIGN_IN_SUCCESS, resetErrorsState);
}

export function* onSignInFailed() {
  yield takeLatest(USER_ACTION_TYPES.SIGN_IN_FAILED, resetLoadingState);
}

export function* onResetErrors() {
  yield takeLatest(USER_ACTION_TYPES.RESET_USER_ERRORS, resetLoadingState);
}

export function* onSignUpFailed() {
  yield takeLatest(USER_ACTION_TYPES.SIGN_UP_FAILED, resetLoadingState);
}

export function* userSagas() {
  yield all([
    call(onCheckUserSession),
    call(onEmailSignInStart),
    call(onGoogleSignInStart),
    call(onSignInSuccess),
    call(onSignInFailed),
    call(onSignUpStart),
    call(onSignUpSuccess),
    call(onSignUpFailed),
    call(onSignOutStart),
    call(onSignOutSuccess),
    call(onSignOutFailed),
    call(onCloseAccountStart),
    call(onCloseAccountSuccess),
    call(onCloseAccountFailed),
    call(onResetErrors),
  ]);
}
