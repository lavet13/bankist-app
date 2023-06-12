import { createAction } from '@reduxjs/toolkit';

import { call, all, put, takeLatest } from 'typed-redux-saga/macro';

import {
  CloseAccountStartPayload,
  EmailSignInStartPayload,
  SignUpStartPayload,
  SignUpSuccessPayload,
} from './user.types';
import { USER_ERROR_MESSAGES } from './user.error';
import {
  deleteUserAccount,
  getCurrentUser,
  getProvidersInfo,
  isAdmin,
  reauthenticateUserWithCredential,
  signInWithGooglePopup,
} from '../../utils/firebase/firebase.utils';

import { generateError } from '../../utils/error/error.utils';

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

import { AuthErrorCodes, User } from 'firebase/auth';

import {
  userLoadingReset,
  signInSucceeded,
  signInFailed,
  userErrorsReset,
  signUpFailed,
  signOutSucceeded,
  signOutFailed,
  closeAccountFailed,
  userSessionChecked,
  emailSignInStarted,
  googleSignInStarted,
  signOutStarted,
  signUpStarted,
  closeAccountStarted,
  userSlice,
} from './user.reducer';

export const closeAccountSucceeded = createAction(
  `${userSlice.name}/closeAccountSucceeded`
);

export const signUpSucceeded = createAction<SignUpSuccessPayload>(
  `${userSlice.name}/signUpSucceeded`
);

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
      const { createdAt, ...userSnapshotData } = userSnapshot.data();
      yield* put(
        signInSucceeded({
          ...userSnapshotData,
          createdAt: JSON.stringify(createdAt),
          id: userSnapshot.id,
          ...admin,
        })
      );
    }
  } catch (error: any) {
    yield* put(signInFailed(error));
  }
}

export function* isUserAuthenticated() {
  try {
    const userAuth = yield* call(getCurrentUser);

    if (!userAuth) return yield* put(signInSucceeded(null));

    yield* call(getSnapshotFromUserAuth, userAuth);
  } catch (error: any) {
    yield* put(signInFailed(error));
  }
}

export function* signInWithEmail(
  action: { payload: EmailSignInStartPayload } & { type: string }
) {
  try {
    const { email, password } = action.payload;

    const userCredential = yield* call(
      signInAuthUserWithEmailAndPassword,
      email,
      password
    );

    if (!userCredential) return;

    yield* call(getSnapshotFromUserAuth, userCredential.user);
  } catch (error: any) {
    yield* put(signInFailed(error));
  }
}

export function* signInWithGoogle() {
  try {
    const { user } = yield* call(signInWithGooglePopup);

    yield* call(getSnapshotFromUserAuth, user);
  } catch (error: any) {
    yield* put(signInFailed(error));
  }
}

export function* resetErrorsState() {
  yield* put(userErrorsReset());
}

export function* signUpWithEmail(
  action: { payload: SignUpStartPayload } & { type: string }
) {
  try {
    const { email, password, confirmPassword, ...additionalDetails } =
      action.payload;

    const { INVALID_PASSWORD } = AuthErrorCodes;

    if (password !== confirmPassword) {
      throw generateError(
        INVALID_PASSWORD,
        USER_ERROR_MESSAGES[INVALID_PASSWORD]
      );
    }

    const userCredential = yield* call(
      createAuthUserWithEmailAndPassword,
      email,
      password
    );

    if (!userCredential) return;

    yield* put(
      signUpSucceeded({ user: userCredential.user, ...additionalDetails })
    );
  } catch (error: any) {
    yield* put(signUpFailed(error));
  }
}

export function* signInAfterSignUp(
  action: { payload: SignUpSuccessPayload } & { type: string }
) {
  const { user, ...additionalDetails } = action.payload;
  yield* call(getSnapshotFromUserAuth, user, additionalDetails);
}

export function* signOut() {
  try {
    yield* call(signOutUser);

    yield* put(signOutSucceeded());
  } catch (error: any) {
    yield* put(signOutFailed(error));
  }
}

export function* closeUserAccount(
  action: {
    payload: CloseAccountStartPayload;
  } & { type: string }
) {
  try {
    // @USER RE-AUTHENTICATED AND CREDENTIALS BEFORE DELETING
    // @REPEATED PROVIDER INFO
    const { currentUser, password, reset } = action.payload;

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
    yield* put(closeAccountSucceeded());
  } catch (error: any) {
    yield* put(closeAccountFailed(error));
  }
}

export function* signOutAfterDeletedUser() {
  try {
    yield* call(onTimeoutInvoke, signOutUser, 2);
    yield* call(resetErrorsState);

    yield* put(signOutSucceeded());
  } catch (error: any) {
    yield* put(signOutFailed(error));
  }
}

export function* resetLoadingState() {
  yield* put(userLoadingReset());
}

export function* clearUserLoans() {
  yield* put(clearLoans());
  yield* call(resetErrorsState);
}

export function* onCheckUserSession() {
  yield* takeLatest(userSessionChecked.type, isUserAuthenticated);
}

export function* onEmailSignInStart() {
  yield* takeLatest(emailSignInStarted.type, signInWithEmail);
}

export function* onGoogleSignInStart() {
  yield* takeLatest(googleSignInStarted.type, signInWithGoogle);
}

export function* onSignUpStart() {
  yield* takeLatest(signUpStarted.type, signUpWithEmail);
}

export function* onSignUpSuccess() {
  yield* takeLatest(signUpSucceeded.type, signInAfterSignUp);
}

export function* onSignOutStart() {
  yield* takeLatest(signOutStarted.type, signOut);
}

export function* onSignOutSuccess() {
  yield* takeLatest(signOutSucceeded.type, clearUserLoans);
}

export function* onSignOutFailed() {
  yield* takeLatest(signOutFailed.type, resetLoadingState);
}

export function* onCloseAccountStart() {
  yield* takeLatest(closeAccountStarted.type, closeUserAccount);
}

export function* onCloseAccountSuccess() {
  yield* takeLatest(closeAccountSucceeded.type, signOutAfterDeletedUser);
}

export function* onCloseAccountFailed() {
  yield* takeLatest(closeAccountFailed.type, resetLoadingState);
}

export function* onSignInSuccess() {
  yield* takeLatest(signInSucceeded.type, resetErrorsState);
}

export function* onSignInFailed() {
  yield* takeLatest(signInFailed.type, resetLoadingState);
}

export function* onResetErrors() {
  yield* takeLatest(userErrorsReset.type, resetLoadingState);
}

export function* onSignUpFailed() {
  yield* takeLatest(signUpFailed.type, resetLoadingState);
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
