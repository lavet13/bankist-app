import { Loan, UserData } from '../../utils/firebase/firebase.types';
import {
  createAction,
  Action,
  ActionWithPayload,
  withMatcher,
} from '../../utils/reducer/reducer.utils';
import { LOAN_ACTION_TYPES, UploadLoanStartPayload } from './loan.types';

export type FetchLoanStart = ActionWithPayload<
  LOAN_ACTION_TYPES.FETCH_LOAN_START,
  UserData
>;

export type FetchLoansStart = Action<LOAN_ACTION_TYPES.FETCH_LOANS_START>;

export type UplaodLoanStart = ActionWithPayload<
  LOAN_ACTION_TYPES.UPLOAD_LOAN_START,
  UploadLoanStartPayload
>;

export type FetchLoanSuccess = ActionWithPayload<
  LOAN_ACTION_TYPES.FETCH_LOAN_SUCCESS,
  Loan[]
>;

export type FetchLoansSuccess = ActionWithPayload<
  LOAN_ACTION_TYPES.FETCH_LOANS_SUCCESS,
  Loan[][]
>;

export type UploadLoanSuccess = Action<LOAN_ACTION_TYPES.UPLOAD_LOAN_SUCCESS>;

export type FetchLoanFailed = ActionWithPayload<
  LOAN_ACTION_TYPES.FETCH_LOAN_FAILED,
  Error
>;

export type FetchLoansFailed = ActionWithPayload<
  LOAN_ACTION_TYPES.FETCH_LOANS_FAILED,
  Error
>;

export type UploadLoanFailed = ActionWithPayload<
  LOAN_ACTION_TYPES.UPLOAD_LOAN_FAILED,
  Error
>;

export type CloseUploadLoanErrorMessage =
  Action<LOAN_ACTION_TYPES.CLOSE_UPLOAD_LOAN_ERROR_MESSAGE>;

export type ClearLoans = Action<LOAN_ACTION_TYPES.CLEAR_LOAN>;

export type ShowSnackbar = Action<LOAN_ACTION_TYPES.SHOW_SNACKBAR>;

export type CloseSnackbar = Action<LOAN_ACTION_TYPES.CLOSE_SNACKBAR>;

export type ResetErrors = Action<LOAN_ACTION_TYPES.RESET_LOAN_ERRORS>;

export type ResetLoading = Action<LOAN_ACTION_TYPES.RESET_LOAN_LOADING>;

export const fetchLoanStart = withMatcher(
  (user: UserData): FetchLoanStart =>
    createAction(LOAN_ACTION_TYPES.FETCH_LOAN_START, user)
);

export const fetchLoansStart = withMatcher(
  (): FetchLoansStart => createAction(LOAN_ACTION_TYPES.FETCH_LOANS_START)
);

export const uploadLoanStart = withMatcher(
  (loanData: UploadLoanStartPayload): UplaodLoanStart =>
    createAction(LOAN_ACTION_TYPES.UPLOAD_LOAN_START, loanData)
);

export const fetchLoanSuccess = withMatcher(
  (loanItems: Loan[]): FetchLoanSuccess =>
    createAction(LOAN_ACTION_TYPES.FETCH_LOAN_SUCCESS, loanItems)
);

export const fetchLoansSuccess = withMatcher(
  (loanItems: Loan[][]): FetchLoansSuccess =>
    createAction(LOAN_ACTION_TYPES.FETCH_LOANS_SUCCESS, loanItems)
);

export const uploadLoanSuccess = withMatcher(
  (): UploadLoanSuccess => createAction(LOAN_ACTION_TYPES.UPLOAD_LOAN_SUCCESS)
);

export const fetchLoanFailed = withMatcher(
  (error: Error): FetchLoanFailed =>
    createAction(LOAN_ACTION_TYPES.FETCH_LOAN_FAILED, error)
);

export const fetchLoansFailed = withMatcher(
  (error: Error): FetchLoansFailed =>
    createAction(LOAN_ACTION_TYPES.FETCH_LOANS_FAILED, error)
);

export const uploadLoanFailed = withMatcher((error: Error) =>
  createAction(LOAN_ACTION_TYPES.UPLOAD_LOAN_FAILED, error)
);

export const closeUploadLoanErrorMessage = withMatcher(
  (): CloseUploadLoanErrorMessage =>
    createAction(LOAN_ACTION_TYPES.CLOSE_UPLOAD_LOAN_ERROR_MESSAGE)
);

export const clearLoans = withMatcher(
  (): ClearLoans => createAction(LOAN_ACTION_TYPES.CLEAR_LOAN)
);

export const showSnackbar = withMatcher(
  (): ShowSnackbar => createAction(LOAN_ACTION_TYPES.SHOW_SNACKBAR)
);

export const closeSnackbar = withMatcher(
  (): CloseSnackbar => createAction(LOAN_ACTION_TYPES.CLOSE_SNACKBAR)
);

export const resetErrors = withMatcher(
  (): ResetErrors => createAction(LOAN_ACTION_TYPES.RESET_LOAN_ERRORS)
);

export const resetLoading = withMatcher(
  (): ResetLoading => createAction(LOAN_ACTION_TYPES.RESET_LOAN_LOADING)
);
