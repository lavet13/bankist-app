import { call, all } from 'redux-saga/effects';

import { loanSagas } from './loan/loan.saga';
import { userSagas } from './user/user.saga';

export function* rootSaga() {
  yield all([call(loanSagas), call(userSagas)]);
}