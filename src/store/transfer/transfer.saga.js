import { all, call, put, takeLatest } from 'redux-saga/effects';

import { TRANSFER_ACTION_TYPES } from './transfer.types';

import {
  transferSuccess,
  transferFailed,
  showSnackbar,
} from './transfer.action';
import { transferAmountToUser } from '../../utils/firebase/firebase.utils';
import { fetchMovementsStart } from '../movement/movement.action';
import { generateErrorAndErrorCode } from '../../utils/error/error.utils';

export function* fetchTransferAsync({
  payload: { currentUser, creditCard, amount, balance, resetFormFields },
}) {
  try {
    if (balance - Math.abs(amount) <= 0) {
      throw generateErrorAndErrorCode(
        'Недостаточно средств для перевода!',
        'transfer/not-enough-cash'
      );
    }
    yield call(transferAmountToUser, currentUser, creditCard, amount);
    yield call(resetFormFields);
    yield put(transferSuccess(currentUser));
  } catch (error) {
    yield put(transferFailed(error));
  }
}

export function* updateMovementsAfterTransaction({ payload: currentUser }) {
  yield put(showSnackbar());
  yield put(fetchMovementsStart(currentUser));
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

export function* transferSagas() {
  yield all([call(onTransferStart), call(onTransferSuccess)]);
}
