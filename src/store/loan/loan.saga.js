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
import { generateError } from '../../utils/error/error.utils';
import { LOAN_ERROR_CODE_TYPES, LOAN_ERROR_MESSAGES } from './loan.error';

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
  payload: { currentUser, formFileFields, formFields, resetForm },
}) {
  try {
    const { TELEPHONE_UNFILLED, CREDIT_CARD_UNFILLED } = LOAN_ERROR_CODE_TYPES;
    const { tel, creditCard } = formFields;

    if (tel.split('').some(char => char === '_'))
      throw generateError(
        TELEPHONE_UNFILLED,
        LOAN_ERROR_MESSAGES[TELEPHONE_UNFILLED]
      );

    if (creditCard.split('').some(char => char === '_'))
      throw generateError(
        CREDIT_CARD_UNFILLED,
        LOAN_ERROR_MESSAGES[CREDIT_CARD_UNFILLED]
      );

    yield call(uploadInfoForLoan, currentUser, formFileFields, formFields);
    yield call(resetForm);
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
    call(onFetchLoansStart),
    call(onUploadStart),
    call(onUploadSuccess),
    call(onUploadFailed),
    call(onResetErrors),
  ]);
}
