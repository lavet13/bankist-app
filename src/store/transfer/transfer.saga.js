import { all, call, put, takeLatest } from 'redux-saga/effects';

import { TRANSFER_ACTION_TYPES } from './transfer.types';
import {
  TRANSFER_ERROR_CODE_TYPES,
  TRANSFER_ERROR_MESSAGES,
} from './transfer.error';

import {
  transferSuccess,
  transferFailed,
  showSnackbar,
} from './transfer.action';
import {
  getUserCreditCard,
  transferAmountToUser,
} from '../../utils/firebase/firebase.utils';
import { fetchMovementsStart } from '../movement/movement.action';
import { generateError } from '../../utils/error/error.utils';
import { MAX_CREDIT_CARD_SIZE } from '../../components/credit-card-input/credit-card-input.component';

export function* fetchTransferAsync({
  payload: { currentUser, creditCard, amount, balance, resetFormFields },
}) {
  try {
    const {
      NOT_ENOUGH_CASH,
      CREDIT_CARD_NOT_FOUND,
      CANNOT_TRANSFER_YOURSELF,
      CREDIT_CARD_UNFILLED,
    } = TRANSFER_ERROR_CODE_TYPES;

    if (creditCard.length < MAX_CREDIT_CARD_SIZE)
      throw generateError(
        CREDIT_CARD_UNFILLED,
        TRANSFER_ERROR_MESSAGES[CREDIT_CARD_UNFILLED]
      );

    const querySnapshot = yield call(getUserCreditCard, creditCard);

    if (!querySnapshot.size)
      throw generateError(
        CREDIT_CARD_NOT_FOUND,
        TRANSFER_ERROR_MESSAGES[CREDIT_CARD_NOT_FOUND]
      );

    const [userToTransfer] = querySnapshot.docs;

    if (userToTransfer.data().creditCard === currentUser.creditCard)
      throw generateError(
        CANNOT_TRANSFER_YOURSELF,
        TRANSFER_ERROR_MESSAGES[CANNOT_TRANSFER_YOURSELF]
      );

    if (balance - Math.abs(amount) <= 0) {
      throw generateError(
        NOT_ENOUGH_CASH,
        TRANSFER_ERROR_MESSAGES[NOT_ENOUGH_CASH]
      );
    }

    yield call(transferAmountToUser, currentUser, userToTransfer, amount);
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
