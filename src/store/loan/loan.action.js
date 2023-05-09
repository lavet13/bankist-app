import { createAction } from '../../utils/reducer/reducer.utils';
import { LOAN_ACTION_TYPES } from './loan.types';

export const fetchLoanStart = user =>
  createAction(LOAN_ACTION_TYPES.FETCH_LOAN_START, user);

export const fetchLoanSuccess = loanItems =>
  createAction(LOAN_ACTION_TYPES.FETCH_LOAN_SUCCESS, loanItems);

export const fetchLoanFailed = error =>
  createAction(LOAN_ACTION_TYPES.FETCH_LOAN_FAILED, error);
