import { call, all, put, takeLatest } from 'redux-saga/effects';
import { LOAN_ACTION_TYPES } from './loan.types';

import { getListOfFilesFromLoan } from '../../utils/firebase/firebase.utils';

import { fetchLoanSuccess, fetchLoanFailed } from './loan.action';

export function* fetchLoanAsync({ payload: user }) {
  if (!user) return;

  try {
    const files = yield call(getListOfFilesFromLoan, user);
    yield put(fetchLoanSuccess(files));
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
