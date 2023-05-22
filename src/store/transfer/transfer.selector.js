import { createSelector } from 'reselect';

const selectTransferReducer = state => state.transfer;

export const selectTransferIsLoading = createSelector(
  [selectTransferReducer],
  transfer => transfer.transferIsLoading
);

export const selectTransferError = createSelector(
  [selectTransferReducer],
  transfer => transfer.transferError
);
