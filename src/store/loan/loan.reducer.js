import { LOAN_ACTION_TYPES } from './loan.types';

export const LOAN_INITIAL_STATE = {
  loanItems: [],
  isLoading: true,
  error: null,
};

export const loanReducer = (state = LOAN_INITIAL_STATE, action = {}) => {
  const { type, payload } = action;

  switch (type) {
    case LOAN_ACTION_TYPES.FETCH_LOAN_START:
    case LOAN_ACTION_TYPES.FETCH_LOANS_START:
      return { ...state, isLoading: true };
    case LOAN_ACTION_TYPES.FETCH_LOAN_SUCCESS:
    case LOAN_ACTION_TYPES.FETCH_LOANS_SUCCESS:
      return { ...state, loanItems: payload, isLoading: false };
    case LOAN_ACTION_TYPES.CLEAR_LOAN:
      return { ...state, loanItems: [], isLoading: true };
    case LOAN_ACTION_TYPES.FETCH_LOAN_FAILED:
    case LOAN_ACTION_TYPES.FETCH_LOANS_FAILED:
      return { ...state, error: payload, isLoading: false };
    default:
      return state;
  }
};
