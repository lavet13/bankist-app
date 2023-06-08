import { TRANSFER_ACTION_TYPES, TransferStartPayload } from './transfer.types';
import {
  createAction,
  Action,
  ActionWithPayload,
  withMatcher,
} from '../../utils/reducer/reducer.utils';
import { UserData } from '../../utils/firebase/firebase.types';

export type TransferStart = ActionWithPayload<
  TRANSFER_ACTION_TYPES.TRANSFER_START,
  TransferStartPayload
>;

export type TransferSuccess = ActionWithPayload<
  TRANSFER_ACTION_TYPES.TRANSFER_SUCCESS,
  UserData
>;

export type TransferFailed = ActionWithPayload<
  TRANSFER_ACTION_TYPES.TRANSFER_FAILED,
  Error
>;

export type ResetTransferLoading =
  Action<TRANSFER_ACTION_TYPES.RESET_TRANSFER_LOADING>;

export type ResetTransferError =
  Action<TRANSFER_ACTION_TYPES.RESET_TRANSFER_ERROR>;

export type CloseTransferErrorMessage =
  Action<TRANSFER_ACTION_TYPES.CLOSE_TRANSFER_ERROR_MESSAGE>;

export type ShowSnackbar = Action<TRANSFER_ACTION_TYPES.SHOW_SNACKBAR>;

export type ClsoeSnackbar = Action<TRANSFER_ACTION_TYPES.CLOSE_SNACKBAR>;

export const transferStart = withMatcher(
  (transferData: TransferStartPayload): TransferStart =>
    createAction(TRANSFER_ACTION_TYPES.TRANSFER_START, transferData)
);

export const transferSuccess = withMatcher(
  (userAuth: UserData): TransferSuccess =>
    createAction(TRANSFER_ACTION_TYPES.TRANSFER_SUCCESS, userAuth)
);

export const transferFailed = withMatcher(
  (error: Error): TransferFailed =>
    createAction(TRANSFER_ACTION_TYPES.TRANSFER_FAILED, error)
);

export const resetLoading = withMatcher(
  (): ResetTransferLoading =>
    createAction(TRANSFER_ACTION_TYPES.RESET_TRANSFER_LOADING)
);

export const resetErrors = withMatcher(
  (): ResetTransferError =>
    createAction(TRANSFER_ACTION_TYPES.RESET_TRANSFER_ERROR)
);

export const closeTransferErrorMessage = withMatcher(
  (): CloseTransferErrorMessage =>
    createAction(TRANSFER_ACTION_TYPES.CLOSE_TRANSFER_ERROR_MESSAGE)
);

export const showSnackbar = withMatcher(
  (): ShowSnackbar => createAction(TRANSFER_ACTION_TYPES.SHOW_SNACKBAR)
);

export const closeSnackbar = withMatcher(
  (): ClsoeSnackbar => createAction(TRANSFER_ACTION_TYPES.CLOSE_SNACKBAR)
);
