import { LOAN_ACTION_TYPES } from './loan.types';

export const LOAN_INITIAL_STATE = {
  loanItems: [],
  isLoading: true,
  error: null,
  uploadLoanError: null,
  uploadLoanIsLoading: false,
  snackbarIsOpen: false,
};

export const loanReducer = (state = LOAN_INITIAL_STATE, action = {}) => {
  const { type, payload } = action;

  switch (type) {
    case LOAN_ACTION_TYPES.SHOW_SNACKBAR:
      return { ...state, snackbarIsOpen: true };
    case LOAN_ACTION_TYPES.CLOSE_SNACKBAR:
      return { ...state, snackbarIsOpen: false };
    case LOAN_ACTION_TYPES.UPLOAD_LOAN_START:
      return { ...state, uploadLoanIsLoading: true };
    case LOAN_ACTION_TYPES.FETCH_LOAN_START:
    case LOAN_ACTION_TYPES.FETCH_LOANS_START:
      return { ...state, isLoading: true };
    case LOAN_ACTION_TYPES.FETCH_LOAN_SUCCESS:
    case LOAN_ACTION_TYPES.FETCH_LOANS_SUCCESS:
      return { ...state, loanItems: payload };
    case LOAN_ACTION_TYPES.CLEAR_LOAN:
      return { ...state, loanItems: [], isLoading: true };
    case LOAN_ACTION_TYPES.FETCH_LOAN_FAILED:
    case LOAN_ACTION_TYPES.FETCH_LOANS_FAILED:
      return { ...state, error: payload };
    case LOAN_ACTION_TYPES.UPLOAD_LOAN_FAILED:
      return { ...state, uploadLoanError: payload };
    case LOAN_ACTION_TYPES.CLOSE_UPLOAD_LOAN_ERROR_MESSAGE:
      return { ...state, uploadLoanError: null };
    case LOAN_ACTION_TYPES.RESET_LOAN_ERRORS:
      return { ...state, uploadLoanError: null, error: null };
    case LOAN_ACTION_TYPES.RESET_LOAN_LOADING:
      return { ...state, uploadLoanIsLoading: false, isLoading: false };
    default:
      return state;
  }
};
