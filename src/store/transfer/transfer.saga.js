import { all, call, put, takeLatest } from 'redux-saga/effects';

import { TRANSFER_ACTION_TYPES } from './transfer.types';

import {
  transferSuccess,
  transferFailed,
  showSnackbar,
  resetErrors,
  resetLoading,
} from './transfer.action';
import {
  getUserCreditCard,
  transferAmountToUser,
} from '../../utils/firebase/firebase.utils';
import { fetchMovementsStart } from '../movement/movement.action';

export function* fetchTransferAsync({
  payload: { currentUser, creditCard, amount, setError, reset },
}) {
  try {
    const { value: creditCardValue } = creditCard;

    const querySnapshot = yield call(getUserCreditCard, creditCardValue);

    if (!querySnapshot.size) {
      setError('creditCard', {
        type: 'notFound',
        message: 'Пользователя с такой кредитной картой не существует',
      });

      return yield call(resetLoadingState);
    }

    const [userToTransfer] = querySnapshot.docs;

    if (userToTransfer.data().creditCard === currentUser.creditCard) {
      setError('creditCard', {
        type: 'transferYourself',
        message: 'Вы не можете передать себе деньги',
      });

      return yield call(resetLoadingState);
    }

    yield call(transferAmountToUser, currentUser, userToTransfer, amount);
    yield call(reset, { creditCard: '' });
    yield put(transferSuccess(currentUser));
  } catch (error) {
    yield put(transferFailed(error));
  }
}

export function* updateMovementsAfterTransaction({ payload: currentUser }) {
  yield put(showSnackbar());
  yield put(fetchMovementsStart(currentUser));
  yield call(resetErrorsState);
}

export function* resetErrorsState() {
  yield put(resetErrors());
}

export function* resetLoadingState() {
  yield put(resetLoading());
}

export function* onTransferStart() {
  yield takeLatest(TRANSFER_ACTION_TYPES.TRANSFER_START, fetchTransferAsync);
}

export function* onTransferSuccess() {
  yield takeLatest(
    TRANSFER_ACTION_TYPES.TRANSFER_SUCCESS,
    updateMovementsAfterTransaction
  );
}

export function* onTransferFailed() {
  yield takeLatest(TRANSFER_ACTION_TYPES.TRANSFER_FAILED, resetLoadingState);
}

export function* onResetErrors() {
  yield takeLatest(
    TRANSFER_ACTION_TYPES.RESET_TRANSFER_ERROR,
    resetLoadingState
  );
}

export function* transferSagas() {
  yield all([
    call(onTransferStart),
    call(onTransferSuccess),
    call(onTransferFailed),
    call(onResetErrors),
  ]);
}
