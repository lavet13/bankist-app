import { call, all, put, takeLatest } from 'redux-saga/effects';

import { USER_ACTION_TYPES } from './user.types';
import {
  getCurrentUser,
  signInWithGooglePopup,
} from '../../utils/firebase/firebase.utils';

import {
  signInSuccess,
  signInFailed,
  signOutSuccess,
  signOutFailed,
} from './user.action';
import {
  createUserDocumentFromAuth,
  signInAuthUserWithEmailAndPassword,
  signOutUser,
} from '../../utils/firebase/firebase.utils';

export function* getSnapshotFromUserAuth(user, additionalDetails) {
  try {
    const userSnapshot = yield call(
      createUserDocumentFromAuth,
      user,
      additionalDetails
    );

    yield put(signInSuccess({ id: userSnapshot.id, ...userSnapshot.data() }));
  } catch (error) {
    yield put(signInFailed(error));
  }
}

export function* isUserAuthenticated() {
  try {
    const userAuth = yield call(getCurrentUser);

    if (!userAuth) {
      yield put(signInSuccess(null));
      return;
    }

    yield call(getSnapshotFromUserAuth, userAuth);
  } catch (error) {
    yield put(signInFailed(error));
  }
}

export function* signInWithEmail({
  payload: { email, password, resetForm, navigateToWorkPage, formIsLoading },
}) {
  formIsLoading(true);
  try {
    const { user } = yield call(
      signInAuthUserWithEmailAndPassword,
      email,
      password
    );

    yield call(getSnapshotFromUserAuth, user);
    yield call(resetForm);
    yield call(navigateToWorkPage);
  } catch (error) {
    yield put(signInFailed(error));
  } finally {
    formIsLoading(false);
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

export function* signOut({ payload: navigateToHome }) {
  try {
    yield call(signOutUser);

    yield put(signOutSuccess());
    yield call(navigateToHome);
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

export function* onSignOut() {
  yield takeLatest(USER_ACTION_TYPES.SIGN_OUT_START, signOut);
}

export function* userSagas() {
  yield all([
    call(onCheckUserSession),
    call(onEmailSignInStart),
    call(onGoogleSignInStart),
    call(onSignOut),
  ]);
}
