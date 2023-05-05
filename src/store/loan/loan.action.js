import { createAction } from '../../utils/reducer/reducer.utils';
import { LOAN_ACTION_TYPES } from './loan.types';

import { getListOfFilesFromLoan } from '../../utils/firebase/firebase.utils';

export const fetchLoanStart = () =>
  createAction(LOAN_ACTION_TYPES.FETCH_LOAN_START);

export const fetchLoanSuccess = loanItems =>
  createAction(LOAN_ACTION_TYPES.FETCH_LOAN_SUCCESS, loanItems);

export const fetchLoanFailed = error =>
  createAction(LOAN_ACTION_TYPES.FETCH_LOAN_FAILED, error);

export const fetchLoanAsync = userAuth => async dispatch => {
  if (!userAuth) return;

  dispatch(fetchLoanStart());

  try {
    const files = await getListOfFilesFromLoan(userAuth);

    dispatch(fetchLoanSuccess(files));
  } catch (error) {
    dispatch(fetchLoanFailed(error));
  }
};
