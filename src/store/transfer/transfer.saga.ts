import { all, call, put, takeLatest } from 'typed-redux-saga/macro';

import { TRANSFER_ACTION_TYPES } from './transfer.types';

import {
  transferSuccess,
  transferFailed,
  showSnackbar,
  resetErrors,
  resetLoading,
  TransferStart,
  TransferSuccess,
} from './transfer.action';
import {
  getUserCreditCard,
  transferAmountToUser,
} from '../../utils/firebase/firebase.utils';
import { fetchMovementsStart } from '../movement/movement.action';
import { generateError } from '../../utils/error/error.utils';
import {
  TRANSFER_ERROR_CODE_TYPES,
  TRANSFER_ERROR_MESSAGES,
} from './transfer.error';

export function* fetchTransferAsync({
  payload: { currentUser, creditCard, amount, reset },
}: TransferStart) {
  try {
    if (!currentUser) return;

    const { CREDIT_CARD_NOT_FOUND, CANNOT_TRANSFER_YOURSELF } =
      TRANSFER_ERROR_CODE_TYPES;
    const { value: creditCardValue } = creditCard;

    const querySnapshot = yield* call(getUserCreditCard, creditCardValue);

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

    yield* call(transferAmountToUser, currentUser, userToTransfer, amount);
    yield* call(reset, { creditCard: { value: '', formattedValue: '' } });
    yield* put(transferSuccess(currentUser));
  } catch (error: any) {
    yield* put(transferFailed(error));
  }
}

export function* updateMovementsAfterTransaction({
  payload: currentUser,
}: TransferSuccess) {
  yield* put(showSnackbar());
  yield* put(fetchMovementsStart(currentUser));
  yield* call(resetErrorsState);
}

export function* resetErrorsState() {
  yield* put(resetErrors());
}

export function* resetLoadingState() {
  yield* put(resetLoading());
}

export function* onTransferStart() {
  yield* takeLatest(TRANSFER_ACTION_TYPES.TRANSFER_START, fetchTransferAsync);
}

export function* onTransferSuccess() {
  yield* takeLatest(
    TRANSFER_ACTION_TYPES.TRANSFER_SUCCESS,
    updateMovementsAfterTransaction
  );
}

export function* onTransferFailed() {
  yield* takeLatest(TRANSFER_ACTION_TYPES.TRANSFER_FAILED, resetLoadingState);
}

export function* onResetErrors() {
  yield* takeLatest(
    TRANSFER_ACTION_TYPES.RESET_TRANSFER_ERROR,
    resetLoadingState
  );
}

export function* transferSagas() {
  yield* all([
    call(onTransferStart),
    call(onTransferSuccess),
    call(onTransferFailed),
    call(onResetErrors),
  ]);
}
