import { call, all, put, takeLatest } from 'typed-redux-saga/macro';

import { USER_ERROR_MESSAGES } from './user.error';
import {
  deleteUserAccount,
  getCurrentUser,
  getProvidersInfo,
  isAdmin,
  reauthenticateUserWithCredential,
  signInWithGooglePopup,
} from '../../common/utils/firebase/firebase.utils';

import { generateError } from '../../common/utils/error/error.utils';

import {
  createUserDocumentFromAuth,
  signInAuthUserWithEmailAndPassword,
  createAuthUserWithEmailAndPassword,
  signOutUser,
} from '../../common/utils/firebase/firebase.utils';

import { loanCleared } from '../loan/loan.slice';

import { onTimeoutInvoke } from '../../common/utils/timeout/timeout.utils';

import {
  AdditionalInformation,
  ProvidersInfoPassword,
} from '../../common/utils/firebase/firebase.types';

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
  signUpSucceeded,
  closeAccountSucceeded,
} from './user.slice';

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
          ...admin,
          createdAt: JSON.stringify(createdAt),
          id: userSnapshot.id,
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
  action: ReturnType<typeof emailSignInStarted>
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

export function* signUpWithEmail(action: ReturnType<typeof signUpStarted>) {
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

export function* signInAfterSignUp(action: ReturnType<typeof signUpSucceeded>) {
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
  action: ReturnType<typeof closeAccountStarted>
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
    yield* all([
      put(userErrorsReset()),
      put(userLoadingReset()),
      put(signOutSucceeded()),
    ]);
  } catch (error: any) {
    yield* put(signOutFailed(error));
  }
}

export function* resetLoadingState() {
  yield* put(userLoadingReset());
}

export function* resetErrorsAndLoadingState() {
  yield* all([put(userErrorsReset()), put(userLoadingReset())]);
}

export function* clearUserLoans() {
  yield* all([
    put(loanCleared()),
    put(userErrorsReset()),
    put(userLoadingReset()),
  ]);
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
  yield* takeLatest(signInSucceeded.type, resetErrorsAndLoadingState);
}

export function* onSignInFailed() {
  yield* takeLatest(signInFailed.type, resetLoadingState);
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
  ]);
}
