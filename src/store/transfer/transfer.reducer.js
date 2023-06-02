import { TRANSFER_ACTION_TYPES } from './transfer.types';

export const TRANSFER_INITIAL_STATE = {
  transferIsLoading: false,
  transferError: null,
  snackbarIsOpen: false,
};

export const transferReducer = (
  state = TRANSFER_INITIAL_STATE,
  action = {}
) => {
  const { type, payload } = action;

  switch (type) {
    case TRANSFER_ACTION_TYPES.TRANSFER_START:
      return { ...state, transferIsLoading: true };
    case TRANSFER_ACTION_TYPES.TRANSFER_FAILED:
      return { ...state, transferError: payload };
    case TRANSFER_ACTION_TYPES.CLOSE_TRANSFER_ERROR_MESSAGE:
      return { ...state, transferError: null };
    case TRANSFER_ACTION_TYPES.SHOW_SNACKBAR:
      return { ...state, snackbarIsOpen: true };
    case TRANSFER_ACTION_TYPES.CLOSE_SNACKBAR:
      return { ...state, snackbarIsOpen: false };
    case TRANSFER_ACTION_TYPES.RESET_TRANSFER_LOADING:
      return { ...state, transferIsLoading: false };
    case TRANSFER_ACTION_TYPES.RESET_TRANSFER_ERROR:
      return { ...state, transferError: null };
    default:
      return state;
  }
};
