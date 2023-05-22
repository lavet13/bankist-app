import { TRANSFER_ACTION_TYPES } from './transfer.types';
import { createAction } from '../../utils/reducer/reducer.utils';

export const transferStart = transferData =>
  createAction(TRANSFER_ACTION_TYPES.TRANSFER_START, transferData);

export const transferSuccess = userAuth =>
  createAction(TRANSFER_ACTION_TYPES.TRANSFER_SUCCESS, userAuth);

export const transferFailed = error =>
  createAction(TRANSFER_ACTION_TYPES.TRANSFER_FAILED, error);
