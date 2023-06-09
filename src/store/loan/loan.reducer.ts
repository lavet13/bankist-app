import { AnyAction } from 'redux';
import { Loan } from '../../utils/firebase/firebase.types';
import {
  clearLoans,
  closeSnackbar,
  closeUploadLoanErrorMessage,
  fetchLoanFailed,
  fetchLoanStart,
  fetchLoanSuccess,
  fetchLoansFailed,
  fetchLoansStart,
  fetchLoansSuccess,
  resetErrors,
  resetLoading,
  showSnackbar,
  uploadLoanFailed,
  uploadLoanStart,
} from './loan.action';
import { GenerateError } from '../../utils/error/error.utils';
import { AuthError } from 'firebase/auth';

export type LoanState = {
  readonly loanItems: Loan[] | Loan[][];
  readonly isLoading: boolean;
  readonly error: Error | null;
  readonly uploadLoanError: GenerateError | AuthError | null;
  readonly uploadLoanIsLoading: boolean;
  readonly snackbarIsOpen: boolean;
};

export const LOAN_INITIAL_STATE: LoanState = {
  loanItems: [],
  isLoading: true,
  error: null,
  uploadLoanError: null,
  uploadLoanIsLoading: false,
  snackbarIsOpen: false,
};

export const loanReducer = (
  state = LOAN_INITIAL_STATE,
  action: AnyAction
): LoanState => {
  if (showSnackbar.match(action)) {
    return { ...state, snackbarIsOpen: true };
  }

  if (closeSnackbar.match(action)) {
    return { ...state, snackbarIsOpen: false };
  }

  if (uploadLoanStart.match(action)) {
    return { ...state, uploadLoanIsLoading: true };
  }

  if (fetchLoanStart.match(action) || fetchLoansStart.match(action)) {
    return { ...state, isLoading: true };
  }

  if (fetchLoanSuccess.match(action) || fetchLoansSuccess.match(action)) {
    return { ...state, loanItems: action.payload };
  }

  if (clearLoans.match(action)) {
    return { ...state, loanItems: [], isLoading: true };
  }

  if (fetchLoanFailed.match(action) || fetchLoansFailed.match(action)) {
    return { ...state, error: action.payload };
  }

  if (uploadLoanFailed.match(action)) {
    return { ...state, uploadLoanError: action.payload };
  }

  if (closeUploadLoanErrorMessage.match(action)) {
    return { ...state, uploadLoanError: null };
  }

  if (resetErrors.match(action)) {
    return { ...state, uploadLoanError: null, error: null };
  }

  if (resetLoading.match(action)) {
    return { ...state, uploadLoanIsLoading: false, isLoading: false };
  }

  return state;
};
