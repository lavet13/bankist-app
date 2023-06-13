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
import { UserData } from '../../common/utils/firebase/firebase.types';
import { UploadLoanStartPayload } from './loan.types';

export function* fetchLoanAsync({
  payload: user,
}: {
  type: string;
  payload: UserData;
}) {
  if (!user) return;

  try {
    const userLoans = yield* call(getUserLoans, user);
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
}: {
  type: string;
  payload: UploadLoanStartPayload;
}) {
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

    yield* call(uploadInfoForLoan, currentUser, fileFields, newFormFields);
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
  yield* put(snackbarShown());
  yield* put(loanErrorsReset());
}

export function* resetErrorsState() {
  yield* put(loanErrorsReset());
}

export function* resetLoadingState() {
  yield* put(loanLoadingReset());
}

export function* onFetchLoanStart() {
  yield* takeLatest(fetchLoanStarted.type, fetchLoanAsync);
}

export function* onFetchLoanSuccess() {
  yield* takeLatest(fetchLoanSucceeded.type, resetErrorsState);
}

export function* onFetchLoanFailed() {
  yield* takeLatest(fetchLoanFailed.type, resetLoadingState);
}

export function* onFetchLoansStart() {
  yield* takeLatest(fetchLoansStarted.type, fetchLoansAsync);
}

export function* onFetchLoansSuccess() {
  yield* takeLatest(fetchLoansSucceeded.type, resetErrorsState);
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

export function* onResetErrors() {
  yield* takeLatest(loanErrorsReset.type, resetLoadingState);
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
    call(onResetErrors),
  ]);
}
