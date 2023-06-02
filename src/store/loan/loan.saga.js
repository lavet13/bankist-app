import { call, all, put, takeLatest } from 'redux-saga/effects';

import { LOAN_ACTION_TYPES } from './loan.types';

import {
  getAllUserLoans,
  getUserLoans,
  uploadInfoForLoan,
} from '../../utils/firebase/firebase.utils';

import {
  fetchLoanSuccess,
  fetchLoanFailed,
  fetchLoansSuccess,
  fetchLoansFailed,
  uploadLoanFailed,
  uploadLoanSuccess,
  resetErrors,
  resetLoading,
  showSnackbar,
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

export function* uploadLoan({
  payload: { currentUser, fields, fileFields, reset },
}) {
  try {
    const {
      tel: { formattedValue: telFormat },
      creditCard: { formattedValue: creditCardFormat },
    } = fields;

    yield call(uploadInfoForLoan, currentUser, fileFields, {
      ...fields,
      tel: telFormat,
      creditCard: creditCardFormat,
    });
    yield call(reset, { tel: '', creditCard: '' });
    yield put(uploadLoanSuccess());
  } catch (error) {
    yield put(uploadLoanFailed(error));
  }
}

export function* showSnackbarAfterUploadLoan() {
  yield put(showSnackbar());
  yield put(resetErrors());
}

export function* resetErrorsState() {
  yield put(resetErrors());
}

export function* resetLoadingState() {
  yield put(resetLoading());
}

export function* onFetchLoanStart() {
  yield takeLatest(LOAN_ACTION_TYPES.FETCH_LOAN_START, fetchLoanAsync);
}

export function* onFetchLoanSuccess() {
  yield takeLatest(LOAN_ACTION_TYPES.FETCH_LOAN_SUCCESS, resetErrorsState);
}

export function* onFetchLoanFailed() {
  yield takeLatest(LOAN_ACTION_TYPES.FETCH_LOAN_FAILED, resetLoadingState);
}

export function* onFetchLoansStart() {
  yield takeLatest(LOAN_ACTION_TYPES.FETCH_LOANS_START, fetchLoansAsync);
}

export function* onFetchLoansSuccess() {
  yield takeLatest(LOAN_ACTION_TYPES.FETCH_LOANS_SUCCESS, resetErrorsState);
}

export function* onFetchLoansFailed() {
  yield takeLatest(LOAN_ACTION_TYPES.FETCH_LOANS_FAILED, resetLoadingState);
}

export function* onUploadStart() {
  yield takeLatest(LOAN_ACTION_TYPES.UPLOAD_LOAN_START, uploadLoan);
}

export function* onUploadSuccess() {
  yield takeLatest(
    LOAN_ACTION_TYPES.UPLOAD_LOAN_SUCCESS,
    showSnackbarAfterUploadLoan
  );
}

export function* onUploadFailed() {
  yield takeLatest(LOAN_ACTION_TYPES.UPLOAD_LOAN_FAILED, resetLoadingState);
}

export function* onResetErrors() {
  yield takeLatest(LOAN_ACTION_TYPES.RESET_LOAN_ERRORS, resetLoadingState);
}

export function* loanSagas() {
  yield all([
    call(onFetchLoanStart),
    call(onFetchLoanSuccess),
    call(onFetchLoanFailed),
    call(onFetchLoansStart),
    call(onFetchLoansSuccess),
    call(onFetchLoansFailed),
    call(onUploadStart),
    call(onUploadSuccess),
    call(onUploadFailed),
    call(onResetErrors),
  ]);
}
