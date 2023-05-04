import { createSelector } from 'reselect';

const selectLoanReducer = state => state.loan;

export const selectLoanArray = createSelector(
  [selectLoanReducer],
  loan => loan.loanItems
);
