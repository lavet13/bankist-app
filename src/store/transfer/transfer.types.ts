import { UseFormReset } from 'react-hook-form';
import { TransferDefaultValues } from '../../components/transfer/transfer.component';
import { UserData } from '../../utils/firebase/firebase.types';

export enum TRANSFER_ACTION_TYPES {
  TRANSFER_START = 'transfer/TRANSFER_START',
  TRANSFER_SUCCESS = 'transfer/TRANSFER_SUCCESS',
  TRANSFER_FAILED = 'transfer/TRANSFER_FAILED',
  RESET_TRANSFER_ERROR = 'transfer/RESET_TRANSFER_ERROR',
  RESET_TRANSFER_LOADING = 'transfer/RESET_TRANSFER_LOADING',
  SHOW_SNACKBAR = 'transfer/SHOW_SNACKBAR',
  CLOSE_SNACKBAR = 'transfer/CLOSE_SNACKBAR',
  CLOSE_TRANSFER_ERROR_MESSAGE = 'transfer/CLOSE_TRANSFER_ERROR_MESSAGE',
}

export type TransferStartPayload = {
  currentUser: UserData | null;
  reset: UseFormReset<TransferDefaultValues>;
} & TransferDefaultValues;
