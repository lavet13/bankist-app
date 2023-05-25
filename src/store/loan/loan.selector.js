import { createSelector } from 'reselect';

const selectLoanReducer = state => state.loan;

export const selectLoanArray = createSelector(
  [selectLoanReducer],
  loan => loan.loanItems
);

export const selectLoanArrayIsLoading = createSelector(
  [selectLoanReducer],
  loan => loan.isLoading
);

export const selectUploadLoanError = createSelector(
  [selectLoanReducer],
  loan => loan.uploadLoanError
);

export const selectUploadLoanIsLoading = createSelector(
  [selectLoanReducer],
  loan => loan.uploadLoanIsLoading
);

export const selectSnackbarIsOpen = createSelector(
  [selectLoanReducer],
  loan => loan.snackbarIsOpen
);
