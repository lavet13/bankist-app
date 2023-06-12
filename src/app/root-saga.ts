import { call, all } from 'typed-redux-saga/macro';

import { loanSagas } from '../features/loan/loan.saga';
import { userSagas } from '../features/user/user.saga';
import { movementSagas } from '../features/movement/movement.saga';
import { transferSagas } from '../features/transfer/transfer.saga';

export function* rootSaga() {
  yield* all([
    call(loanSagas),
    call(userSagas),
    call(movementSagas),
    call(transferSagas),
  ]);
}
