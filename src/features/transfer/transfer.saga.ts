import { all, call, put, takeLatest } from 'typed-redux-saga/macro';

import {
  transferStarted,
  transferFailed,
  snackbarShown,
  transferErrorsReset,
  transferLoadingReset,
  transferSucceeded,
} from './transfer.slice';

import {
  getUserCreditCard,
  transferAmountToUser,
} from '../../common/utils/firebase/firebase.utils';
import { generateError } from '../../common/utils/error/error.utils';
import {
  TRANSFER_ERROR_CODE_TYPES,
  TRANSFER_ERROR_MESSAGES,
} from './transfer.error';

export function* fetchTransferAsync(
  action: ReturnType<typeof transferStarted>
) {
  try {
    const { currentUser, creditCard, amount, reset } = action.payload;
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

    yield* call(transferAmountToUser, currentUser.id, userToTransfer, amount);
    yield* call(reset, { creditCard: { value: '', formattedValue: '' } });
    yield* put(transferSucceeded());
  } catch (error: any) {
    yield* put(transferFailed(error));
  }
}

export function* updateMovementsAfterTransaction() {
  yield* all([
    put(snackbarShown()),
    put(transferErrorsReset()),
    put(transferLoadingReset()),
  ]);
}

export function* resetLoadingState() {
  yield* put(transferLoadingReset());
}

export function* onTransferStart() {
  yield* takeLatest(transferStarted.type, fetchTransferAsync);
}

export function* onTransferSuccess() {
  yield* takeLatest(transferSucceeded.type, updateMovementsAfterTransaction);
}

export function* onTransferFailed() {
  yield* takeLatest(transferFailed.type, resetLoadingState);
}

export function* transferSagas() {
  yield* all([
    call(onTransferStart),
    call(onTransferSuccess),
    call(onTransferFailed),
  ]);
}
