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
import { MAX_TEL_SIZE } from '../../components/telephone-input/telephone-input.component';
import { MAX_CREDIT_CARD_SIZE } from '../../components/credit-card-input/credit-card-input.component';

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
  payload: { currentUser, formFileFields, formFields, resetFormField },
}) {
  try {
    const {
      TELEPHONE_UNFILLED,
      CREDIT_CARD_UNFILLED,
      DISPLAY_NAME_UNFILLED,
      INVALID_EMAIL_VALIDATION,
      AMOUNT_IS_ZERO,
      PASSPORT_IS_UNFILLED,
      FINANCIALS_IS_UNFILLED,
      COLLATERAL_IS_UNFILLED,
      EMPLOYMENT_IS_UNFILLED,
    } = LOAN_ERROR_CODE_TYPES;
    const {
      tel: { value: telValue, formattedValue: telFormat },
      creditCard,
      displayName,
      email,
      amount,
    } = formFields;

    if (!displayName.length)
      throw generateError(
        DISPLAY_NAME_UNFILLED,
        LOAN_ERROR_MESSAGES[DISPLAY_NAME_UNFILLED]
      );

    if (
      !email.match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
    )
      throw generateError(
        INVALID_EMAIL_VALIDATION,
        LOAN_ERROR_MESSAGES[INVALID_EMAIL_VALIDATION]
      );

    if (telValue.length < MAX_TEL_SIZE)
      throw generateError(
        TELEPHONE_UNFILLED,
        LOAN_ERROR_MESSAGES[TELEPHONE_UNFILLED]
      );

    if (creditCard.length < MAX_CREDIT_CARD_SIZE)
      throw generateError(
        CREDIT_CARD_UNFILLED,
        LOAN_ERROR_MESSAGES[CREDIT_CARD_UNFILLED]
      );

    if (amount <= 0)
      throw generateError(AMOUNT_IS_ZERO, LOAN_ERROR_MESSAGES[AMOUNT_IS_ZERO]);

    const { passportPhoto, employment, financials, collateral } =
      formFileFields;

    if (!passportPhoto)
      throw generateError(
        PASSPORT_IS_UNFILLED,
        LOAN_ERROR_MESSAGES[PASSPORT_IS_UNFILLED]
      );

    if (!employment)
      throw generateError(
        EMPLOYMENT_IS_UNFILLED,
        LOAN_ERROR_MESSAGES[EMPLOYMENT_IS_UNFILLED]
      );

    if (!financials)
      throw generateError(
        FINANCIALS_IS_UNFILLED,
        LOAN_ERROR_MESSAGES[FINANCIALS_IS_UNFILLED]
      );

    if (!collateral)
      throw generateError(
        COLLATERAL_IS_UNFILLED,
        LOAN_ERROR_MESSAGES[COLLATERAL_IS_UNFILLED]
      );

    const newFormFields = { ...formFields, tel: telFormat };

    yield call(uploadInfoForLoan, currentUser, formFileFields, newFormFields);
    yield call(resetFormField);
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
