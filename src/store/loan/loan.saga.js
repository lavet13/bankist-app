import { call, all, put, takeLatest } from 'redux-saga/effects';
import { LOAN_ACTION_TYPES } from './loan.types';

import {
  getAllUserLoans,
  getUserLoans,
} from '../../utils/firebase/firebase.utils';

import {
  fetchLoanSuccess,
  fetchLoanFailed,
  fetchLoansSuccess,
  fetchLoansFailed,
} from './loan.action';

export function* fetchLoanAsync({ payload: user }) {
  if (!user) return;

  try {
    const userLoans = yield call(getUserLoans, user);
    yield put(fetchLoanSuccess(userLoans));
  } catch (error) {
    yield put(fetchLoanFailed(error));
  }
}

export function* fetchLoansAsync() {
  try {
    const userLoans = yield call(getAllUserLoans);
    yield put(fetchLoansSuccess(userLoans));
  } catch (error) {
    yield put(fetchLoansFailed(error));
  }
}

export function* onFetchLoanStart() {
  yield takeLatest(LOAN_ACTION_TYPES.FETCH_LOAN_START, fetchLoanAsync);
}

export function* onFetchLoansStart() {
  yield takeLatest(LOAN_ACTION_TYPES.FETCH_LOANS_START, fetchLoansAsync);
}

export function* loanSagas() {
  yield all([call(onFetchLoanStart), call(onFetchLoansStart)]);
}
