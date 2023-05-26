import { createAction } from '../../utils/reducer/reducer.utils';
import { LOAN_ACTION_TYPES } from './loan.types';

export const fetchLoanStart = user =>
  createAction(LOAN_ACTION_TYPES.FETCH_LOAN_START, user);

export const fetchLoansStart = () =>
  createAction(LOAN_ACTION_TYPES.FETCH_LOANS_START);

export const uploadLoanStart = loanData =>
  createAction(LOAN_ACTION_TYPES.UPLOAD_LOAN_START, loanData);

export const fetchLoanSuccess = loanItems =>
  createAction(LOAN_ACTION_TYPES.FETCH_LOAN_SUCCESS, loanItems);

export const fetchLoansSuccess = loanItems =>
  createAction(LOAN_ACTION_TYPES.FETCH_LOANS_SUCCESS, loanItems);

export const uploadLoanSuccess = () =>
  createAction(LOAN_ACTION_TYPES.UPLOAD_LOAN_SUCCESS);

export const fetchLoanFailed = error =>
  createAction(LOAN_ACTION_TYPES.FETCH_LOAN_FAILED, error);

export const fetchLoansFailed = error =>
  createAction(LOAN_ACTION_TYPES.FETCH_LOANS_FAILED, error);

export const uploadLoanFailed = error =>
  createAction(LOAN_ACTION_TYPES.UPLOAD_LOAN_FAILED, error);

export const closeUploadLoanErrorMessage = () =>
  createAction(LOAN_ACTION_TYPES.CLOSE_UPLOAD_LOAN_ERROR_MESSAGE);

export const clearLoans = () => createAction(LOAN_ACTION_TYPES.CLEAR_LOAN);

export const showSnackbar = () => createAction(LOAN_ACTION_TYPES.SHOW_SNACKBAR);

export const closeSnackbar = () =>
  createAction(LOAN_ACTION_TYPES.CLOSE_SNACKBAR);

export const resetErrors = () =>
  createAction(LOAN_ACTION_TYPES.RESET_LOAN_ERRORS);

export const resetLoading = () =>
  createAction(LOAN_ACTION_TYPES.RESET_LOAN_LOADING);
