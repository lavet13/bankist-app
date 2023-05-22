import { call, all, put, takeLatest } from 'redux-saga/effects';

import { USER_ACTION_TYPES } from './user.types';
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
    if (
      !email.match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
    )
      return yield put(
        signInFailed(
          generateErrorAndErrorCode(
            'Неверный формат E-mail',
            'auth/invalid-email-validation'
          )
        )
      );

    if (password.length < 6)
      return yield put(
        signInFailed(
          generateErrorAndErrorCode(
            'Пароль должен составлять как минимум 6 символов',
            'auth/weak-password-validation'
          )
        )
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

export function* signUpWithEmail({
  payload: { email, password, confirmPassword, ...additionalDetails },
}) {
  try {
    const { displayName } = additionalDetails;
    if (!displayName.length)
      return yield put(
        signUpFailed(
          generateErrorAndErrorCode(
            'Имя пользователя не было указано!',
            'auth/display-name-not-found'
          )
        )
      );

    if (
      !email.match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
    )
      return yield put(
        signUpFailed(
          generateErrorAndErrorCode(
            'Неверный формат E-mail',
            'auth/invalid-email-validation'
          )
        )
      );

    if (password !== confirmPassword) {
      return yield put(
        signUpFailed(
          generateErrorAndErrorCode(
            'Пароли не совпадают!',
            'auth/wrong-password'
          )
        )
      );
    }

    if (password.length < 6)
      return yield put(
        signUpFailed(
          generateErrorAndErrorCode(
            'Пароль должен составлять как минимум 6 символов',
            'auth/weak-password-validation'
          )
        )
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
    // @USER RE-AUTHENTICATED AND CREDENTIALS BEFORE DELETING
    // @REPEATED PROVIDER INFO

    if (password !== null) {
      if (password === '')
        return yield put(
          closeAccountFailed(
            generateErrorAndErrorCode(
              'Не указан пароль!',
              'closed-account/missing-password'
            )
          )
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

    yield put(signOutSuccess());
  } catch (error) {
    yield put(signOutFailed(error));
  }
}

export function* clearUserLoans() {
  yield put(clearLoans());
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

export function* onSignOutSuccess() {
  yield takeLatest(USER_ACTION_TYPES.SIGN_OUT_SUCCESS, clearUserLoans);
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

export function* userSagas() {
  yield all([
    call(onCheckUserSession),
    call(onEmailSignInStart),
    call(onGoogleSignInStart),
    call(onSignUpStart),
    call(onSignUpSuccess),
    call(onSignOut),
    call(onSignOutSuccess),
    call(onCloseAccountStart),
    call(onCloseAccountSuccess),
  ]);
}
