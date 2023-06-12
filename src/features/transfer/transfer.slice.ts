import { AuthError } from 'firebase/auth';
import { GenerateError } from '../../common/utils/error/error.utils';
import { PayloadAction, createAction, createSlice } from '@reduxjs/toolkit';
import { TransferStartPayload } from './transfer.types';
import { withPayloadType } from '../../app/store';
import { UserData } from '../../common/utils/firebase/firebase.types';

type TransferState = {
  readonly transferIsLoading: boolean;
  readonly transferError: GenerateError | AuthError | null;
  readonly snackbarIsOpen: boolean;
};

const initialState: TransferState = {
  transferIsLoading: false,
  transferError: null,
  snackbarIsOpen: false,
};

export const transferSlice = createSlice({
  name: 'transfer',
  initialState,
  reducers: {
    transferStarted(state, _: PayloadAction<TransferStartPayload>) {
      state.transferIsLoading = true;
    },
    transferFailed(state, action: PayloadAction<Error>) {
      state.transferError = action.payload;
    },
    transferErrorMessageClosed(state, _: PayloadAction<void>) {
      state.transferError = null;
    },
    snackbarShown(state, _: PayloadAction<void>) {
      state.snackbarIsOpen = true;
    },
    snackbarClosed(state, _: PayloadAction<void>) {
      state.snackbarIsOpen = false;
    },
    transferErrorsReset(state, _: PayloadAction<void>) {
      state.transferError = null;
    },
    transferLoadingReset(state, _: PayloadAction<void>) {
      state.transferIsLoading = false;
    },
  },
});

export default transferSlice.reducer;
export const {
  transferStarted,
  snackbarClosed,
  snackbarShown,
  transferErrorMessageClosed,
  transferErrorsReset,
  transferFailed,
  transferLoadingReset,
} = transferSlice.actions;

export const transferSucceeded = createAction(
  `${transferSlice.name}/transferSucceeded`,
  withPayloadType<UserData>()
);
