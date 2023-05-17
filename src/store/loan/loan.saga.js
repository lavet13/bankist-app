import { call, all, put, takeLatest } from 'redux-saga/effects';
import { LOAN_ACTION_TYPES } from './loan.types';

import { getUserLoans } from '../../utils/firebase/firebase.utils';

import { fetchLoanSuccess, fetchLoanFailed } from './loan.action';

export function* fetchLoanAsync({ payload: user }) {
  if (!user) return;

  try {
    const userLoans = yield call(getUserLoans, user);
    yield put(fetchLoanSuccess(userLoans));
  } catch (error) {
    yield put(fetchLoanFailed(error));
  }
}

export function* onFetchLoanStart() {
  yield takeLatest(LOAN_ACTION_TYPES.FETCH_LOAN_START, fetchLoanAsync);
}

export function* loanSagas() {
  yield all([call(onFetchLoanStart)]);
}
