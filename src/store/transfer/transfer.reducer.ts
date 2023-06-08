import { GenerateError } from '../../utils/error/error.utils';
import {
  closeSnackbar,
  closeTransferErrorMessage,
  resetErrors,
  resetLoading,
  showSnackbar,
  transferFailed,
  transferStart,
} from './transfer.action';
import { AnyAction } from 'redux';

export type TransferState = {
  readonly transferIsLoading: boolean;
  readonly transferError: Error | GenerateError | null;
  readonly snackbarIsOpen: boolean;
};

export const TRANSFER_INITIAL_STATE: TransferState = {
  transferIsLoading: false,
  transferError: null,
  snackbarIsOpen: false,
};

export const transferReducer = (
  state = TRANSFER_INITIAL_STATE,
  action: AnyAction
): TransferState => {
  if (transferStart.match(action)) {
    return { ...state, transferIsLoading: true };
  }

  if (transferFailed.match(action)) {
    return { ...state, transferError: action.payload };
  }

  if (closeTransferErrorMessage.match(action)) {
    return { ...state, transferError: null };
  }

  if (showSnackbar.match(action)) {
    return { ...state, snackbarIsOpen: true };
  }

  if (closeSnackbar.match(action)) {
    return { ...state, snackbarIsOpen: false };
  }

  if (resetLoading.match(action)) {
    return { ...state, transferIsLoading: false };
  }

  if (resetErrors.match(action)) {
    return { ...state, transferError: null };
  }

  return state;
};
