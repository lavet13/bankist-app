import { call, all, put, takeLatest } from 'typed-redux-saga/macro';

import { USER_ACTION_TYPES } from './user.types';
import { USER_ERROR_CODE_TYPES, USER_ERROR_MESSAGES } from './user.error';
import {
  deleteUserAccount,
  getCurrentUser,
  getProvidersInfo,
  isAdmin,
  reauthenticateUserWithCredential,
  signInWithGooglePopup,
} from '../../utils/firebase/firebase.utils';
import { GenerateError, generateError } from '../../utils/error/error.utils';

import {
  signInSuccess,
  signInFailed,
  signOutSuccess,
  signOutFailed,
  signUpFailed,
  signUpSuccess,
  closeAccountFailed,
  closeAccountSuccess,
  resetErrors,
  resetUserLoading,
  SignUpStart,
  SignUpSuccess,
  CloseAccountStart,
  EmailSignInStart,
} from './user.action';
import {
  createUserDocumentFromAuth,
  signInAuthUserWithEmailAndPassword,
  createAuthUserWithEmailAndPassword,
  signOutUser,
} from '../../utils/firebase/firebase.utils';
import { clearLoans } from '../loan/loan.action';
import { onTimeoutInvoke } from '../../utils/timeout/timeout.utils';
import {
  AdditionalInformation,
  ProvidersInfoPassword,
} from '../../utils/firebase/firebase.types';
import { User } from 'firebase/auth';

export function* getSnapshotFromUserAuth(
  user: User,
  additionalDetails?: AdditionalInformation
) {
  try {
    const userSnapshot = yield* call(
      createUserDocumentFromAuth,
      user,
      additionalDetails
    );

    const admin = yield* call(isAdmin, user);

    if (userSnapshot && userSnapshot.exists()) {
      yield* put(
        signInSuccess({ id: userSnapshot.id, ...userSnapshot.data(), ...admin })
      );
    }
  } catch (error) {
    yield* put(signInFailed(error as Error));
  }
}

export function* isUserAuthenticated() {
  try {
    const userAuth = yield* call(getCurrentUser);

    if (!userAuth) return yield* put(signInSuccess(null));

    yield* call(getSnapshotFromUserAuth, userAuth);
  } catch (error) {
    yield* put(signInFailed(error as Error));
  }
}

export function* signInWithEmail({
  payload: { email, password },
}: EmailSignInStart) {
  try {
    const userCredential = yield* call(
      signInAuthUserWithEmailAndPassword,
      email,
      password
    );
    if (!userCredential) return;

    yield* call(getSnapshotFromUserAuth, userCredential.user);
  } catch (error) {
    yield* put(signInFailed(error as Error));
  }
}

export function* signInWithGoogle() {
  try {
    const { user } = yield* call(signInWithGooglePopup);

    yield* call(getSnapshotFromUserAuth, user);
  } catch (error) {
    yield* put(signInFailed(error as Error));
  }
}

export function* resetErrorsState() {
  yield* put(resetErrors());
}

export function* signUpWithEmail({
  payload: { email, password, confirmPassword, ...additionalDetails },
}: SignUpStart) {
  try {
    const { WRONG_PASSWORD } = USER_ERROR_CODE_TYPES;

    if (password !== confirmPassword) {
      throw generateError(WRONG_PASSWORD, USER_ERROR_MESSAGES[WRONG_PASSWORD]);
    }

    const userCredential = yield* call(
      createAuthUserWithEmailAndPassword,
      email,
      password
    );

    if (!userCredential) return;

    yield* put(signUpSuccess(userCredential.user, additionalDetails));
  } catch (error) {
    yield* put(signUpFailed(error as Error));
  }
}

export function* signInAfterSignUp({
  payload: { user, ...additionalDetails },
}: SignUpSuccess) {
  yield* call(getSnapshotFromUserAuth, user, additionalDetails);
}

export function* signOut() {
  try {
    yield* call(signOutUser);

    yield* put(signOutSuccess());
  } catch (error) {
    yield* put(signOutFailed(error as Error));
  }
}

export function* closeUserAccount({
  payload: { currentUser, reset, password },
}: CloseAccountStart) {
  try {
    // @USER RE-AUTHENTICATED AND CREDENTIALS BEFORE DELETING
    // @REPEATED PROVIDER INFO

    if (password !== null) {
      const providerInfo = getProvidersInfo(currentUser).map(profile =>
        profile.providerId === 'password'
          ? ({ ...profile, password } as ProvidersInfoPassword)
          : profile
      );

      const userCredential = yield* call(
        reauthenticateUserWithCredential,
        providerInfo
      );
      if (!userCredential) return;

      yield* call(deleteUserAccount, userCredential.user);
    } else {
      const providerInfo = getProvidersInfo(currentUser);

      const userCredential = yield* call(
        reauthenticateUserWithCredential,
        providerInfo
      );
      if (!userCredential) return;

      yield* call(deleteUserAccount, userCredential.user);
    }

    yield* call(reset);
    yield* put(closeAccountSuccess());
  } catch (error) {
    yield* put(closeAccountFailed(error as Error | GenerateError));
  }
}

export function* signOutAfterDeletedUser() {
  try {
    yield* call(onTimeoutInvoke, signOutUser, 2);
    yield* call(resetErrorsState);

    yield* put(signOutSuccess());
  } catch (error) {
    yield* put(signOutFailed(error as Error));
  }
}

export function* resetLoadingState() {
  yield* put(resetUserLoading());
}

export function* clearUserLoans() {
  yield* put(clearLoans());
  yield* call(resetErrorsState);
}

export function* onCheckUserSession() {
  yield* takeLatest(USER_ACTION_TYPES.CHECK_USER_SESSION, isUserAuthenticated);
}

export function* onEmailSignInStart() {
  yield* takeLatest(USER_ACTION_TYPES.EMAIL_SIGN_IN_START, signInWithEmail);
}

export function* onGoogleSignInStart() {
  yield* takeLatest(USER_ACTION_TYPES.GOOGLE_SIGN_IN_START, signInWithGoogle);
}

export function* onSignUpStart() {
  yield* takeLatest(USER_ACTION_TYPES.SIGN_UP_START, signUpWithEmail);
}

export function* onSignUpSuccess() {
  yield* takeLatest(USER_ACTION_TYPES.SIGN_UP_SUCCESS, signInAfterSignUp);
}

export function* onSignOutStart() {
  yield* takeLatest(USER_ACTION_TYPES.SIGN_OUT_START, signOut);
}

export function* onSignOutSuccess() {
  yield* takeLatest(USER_ACTION_TYPES.SIGN_OUT_SUCCESS, clearUserLoans);
}

export function* onSignOutFailed() {
  yield* takeLatest(USER_ACTION_TYPES.SIGN_OUT_FAILED, resetLoadingState);
}

export function* onCloseAccountStart() {
  yield* takeLatest(USER_ACTION_TYPES.CLOSE_ACCOUNT_START, closeUserAccount);
}

export function* onCloseAccountSuccess() {
  yield* takeLatest(
    USER_ACTION_TYPES.CLOSE_ACCOUNT_SUCCESS,
    signOutAfterDeletedUser
  );
}

export function* onCloseAccountFailed() {
  yield* takeLatest(USER_ACTION_TYPES.CLOSE_ACCOUNT_FAILED, resetLoadingState);
}

export function* onSignInSuccess() {
  yield* takeLatest(USER_ACTION_TYPES.SIGN_IN_SUCCESS, resetErrorsState);
}

export function* onSignInFailed() {
  yield* takeLatest(USER_ACTION_TYPES.SIGN_IN_FAILED, resetLoadingState);
}

export function* onResetErrors() {
  yield* takeLatest(USER_ACTION_TYPES.RESET_USER_ERRORS, resetLoadingState);
}

export function* onSignUpFailed() {
  yield* takeLatest(USER_ACTION_TYPES.SIGN_UP_FAILED, resetLoadingState);
}

export function* userSagas() {
  yield* all([
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
