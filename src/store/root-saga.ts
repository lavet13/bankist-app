import { call, all } from 'typed-redux-saga/macro';

import { loanSagas } from './loan/loan.saga';
import { userSagas } from './user/user.saga';
import { movementSagas } from './movement/movement.saga';
import { transferSagas } from './transfer/transfer.saga';

export function* rootSaga() {
  yield* all([
    call(loanSagas),
    call(userSagas),
    call(movementSagas),
    call(transferSagas),
  ]);
}