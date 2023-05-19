import { createAction } from '../../utils/reducer/reducer.utils';
import { LOAN_ACTION_TYPES } from './loan.types';

export const fetchLoanStart = user =>
  createAction(LOAN_ACTION_TYPES.FETCH_LOAN_START, user);

export const fetchLoanSuccess = loanItems =>
  createAction(LOAN_ACTION_TYPES.FETCH_LOAN_SUCCESS, loanItems);

export const fetchLoanFailed = error =>
  createAction(LOAN_ACTION_TYPES.FETCH_LOAN_FAILED, error);

export const fetchLoansStart = () =>
  createAction(LOAN_ACTION_TYPES.FETCH_LOANS_START);

export const fetchLoansSuccess = loanItems =>
  createAction(LOAN_ACTION_TYPES.FETCH_LOANS_SUCCESS, loanItems);

export const fetchLoansFailed = error =>
  createAction(LOAN_ACTION_TYPES.FETCH_LOANS_FAILED, error);

export const clearLoans = () => createAction(LOAN_ACTION_TYPES.CLEAR_LOAN);
