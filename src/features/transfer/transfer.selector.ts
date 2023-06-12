import { createSelector } from 'reselect';
import { RootState } from '../../app/store';

const selectTransferReducer = (state: RootState) => state.transfer;

export const selectTransferIsLoading = createSelector(
  [selectTransferReducer],
  transfer => transfer.transferIsLoading
);

export const selectTransferError = createSelector(
  [selectTransferReducer],
  transfer => transfer.transferError
);

export const selectSnackbarIsOpen = createSelector(
  [selectTransferReducer],
  transfer => transfer.snackbarIsOpen
);
