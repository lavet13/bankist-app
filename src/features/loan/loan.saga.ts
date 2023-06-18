import { call, all, put, takeLatest } from 'typed-redux-saga/macro';

import {
  getAllUserLoans,
  getUserLoans,
  uploadInfoForLoan,
} from '../../common/utils/firebase/firebase.utils';

import {
  fetchLoanFailed,
  fetchLoanStarted,
  fetchLoanSucceeded,
  fetchLoansFailed,
  fetchLoansStarted,
  fetchLoansSucceeded,
  loanErrorsReset,
  loanLoadingReset,
  snackbarShown,
  uploadingLoanFailed,
  uploadingLoanStarted,
  uploadingLoanSucceeded,
} from './loan.slice';
import { FormFields } from '../../components/loan/loan-form.component';

export function* fetchLoanAsync({
  payload: userId,
}: ReturnType<typeof fetchLoanStarted>) {
  try {
    const userLoans = yield* call(getUserLoans, userId);
    yield* put(fetchLoanSucceeded(userLoans));
  } catch (error: any) {
    yield* put(fetchLoanFailed(error));
  }
}

export function* fetchLoansAsync() {
  try {
    const userLoans = yield* call(getAllUserLoans);
    yield* put(fetchLoansSucceeded(userLoans));
  } catch (error: any) {
    yield* put(fetchLoansFailed(error));
  }
}

export type newFormFields = {
  [key in keyof FormFields]: FormFields[key] extends object
    ? string
    : FormFields[key];
};

export function* uploadLoan({
  payload: { currentUser, fields, fileFields, reset },
}: ReturnType<typeof uploadingLoanStarted>) {
  try {
    const {
      tel: { formattedValue: telFormat },
      creditCard: { formattedValue: creditCardFormat },
    } = fields;

    const newFormFields: newFormFields = {
      ...fields,
      tel: telFormat,
      creditCard: creditCardFormat,
    };

    yield* call(uploadInfoForLoan, currentUser.id, fileFields, newFormFields);
    yield* call(reset, {
      tel: { value: '', formattedValue: '' },
      creditCard: { value: '', formattedValue: '' },
    });
    yield* put(uploadingLoanSucceeded());
  } catch (error: any) {
    yield* put(uploadingLoanFailed(error));
  }
}

export function* showSnackbarAfterUploadLoan() {
  yield* all([
    put(snackbarShown()),
    put(loanErrorsReset()),
    put(loanLoadingReset()),
  ]);
}

export function* resetErrorsAndLoadingState() {
  yield* all([put(loanErrorsReset()), put(loanLoadingReset())]);
}

export function* resetLoadingState() {
  yield* put(loanLoadingReset());
}

export function* onFetchLoanStart() {
  yield* takeLatest(fetchLoanStarted.type, fetchLoanAsync);
}

export function* onFetchLoanSuccess() {
  yield* takeLatest(fetchLoanSucceeded.type, resetErrorsAndLoadingState);
}

export function* onFetchLoanFailed() {
  yield* takeLatest(fetchLoanFailed.type, resetLoadingState);
}

export function* onFetchLoansStart() {
  yield* takeLatest(fetchLoansStarted.type, fetchLoansAsync);
}

export function* onFetchLoansSuccess() {
  yield* takeLatest(fetchLoansSucceeded.type, resetErrorsAndLoadingState);
}

export function* onFetchLoansFailed() {
  yield* takeLatest(fetchLoansFailed.type, resetLoadingState);
}

export function* onUploadStart() {
  yield* takeLatest(uploadingLoanStarted.type, uploadLoan);
}

export function* onUploadSuccess() {
  yield* takeLatest(uploadingLoanSucceeded.type, showSnackbarAfterUploadLoan);
}

export function* onUploadFailed() {
  yield* takeLatest(uploadingLoanFailed.type, resetLoadingState);
}

export function* loanSagas() {
  yield* all([
    call(onFetchLoanStart),
    call(onFetchLoanSuccess),
    call(onFetchLoanFailed),
    call(onFetchLoansStart),
    call(onFetchLoansSuccess),
    call(onFetchLoansFailed),
    call(onUploadStart),
    call(onUploadSuccess),
    call(onUploadFailed),
  ]);
}
