import { call, all, put, takeLatest } from 'redux-saga/effects';

import { USER_ACTION_TYPES } from './user.types';
import {
  getCurrentUser,
  isAdmin,
  signInWithGooglePopup,
} from '../../utils/firebase/firebase.utils';

import {
  signInSuccess,
  signInFailed,
  signOutSuccess,
  signOutFailed,
  signUpFailed,
  signUpSuccess,
} from './user.action';
import {
  createUserDocumentFromAuth,
  signInAuthUserWithEmailAndPassword,
  createAuthUserWithEmailAndPassword,
  signOutUser,
} from '../../utils/firebase/firebase.utils';

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

export function* signInWithEmail({
  payload: { email, password, navigateToWorkPage },
}) {
  try {
    const { user } = yield call(
      signInAuthUserWithEmailAndPassword,
      email,
      password
    );

    yield call(getSnapshotFromUserAuth, user);
    yield call(navigateToWorkPage);
  } catch (error) {
    yield put(signInFailed(error));
  }
}

export function* signInWithGoogle({ payload: navigateToWorkPage }) {
  try {
    const { user } = yield call(signInWithGooglePopup);

    yield call(getSnapshotFromUserAuth, user);
    yield call(navigateToWorkPage);
  } catch (error) {
    yield put(signInFailed(error));
  }
}

export function* signUpWithEmail({
  payload: {
    email,
    password,
    confirmPassword,
    navigateToWork,
    ...additionalDetails
  },
}) {
  try {
    if (password !== confirmPassword) {
      return yield put(signUpFailed(new Error('Пароли не совпадают!')));
    }

    const { user } = yield call(
      createAuthUserWithEmailAndPassword,
      email,
      password
    );

    yield put(signUpSuccess(user, additionalDetails, navigateToWork));
  } catch (error) {
    yield put(signUpFailed(error));
  }
}

export function* signInAfterSignUp({
  payload: { user, navigateToWork, ...additionalDetails },
}) {
  yield call(getSnapshotFromUserAuth, user, additionalDetails);
  yield call(navigateToWork);
}

export function* signOut() {
  try {
    yield call(signOutUser);

    yield put(signOutSuccess());
  } catch (error) {
    yield put(signOutFailed(error));
  }
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

export function* onSignOut() {
  yield takeLatest(USER_ACTION_TYPES.SIGN_OUT_START, signOut);
}

export function* userSagas() {
  yield all([
    call(onCheckUserSession),
    call(onEmailSignInStart),
    call(onGoogleSignInStart),
    call(onSignUpStart),
    call(onSignUpSuccess),
    call(onSignOut),
  ]);
}
