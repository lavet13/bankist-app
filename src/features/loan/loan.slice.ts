import { Loan } from '../../common/utils/firebase/firebase.types';
import { GenerateError } from '../../common/utils/error/error.utils';
import { AuthError } from 'firebase/auth';
import { PayloadAction, createAction, createSlice } from '@reduxjs/toolkit';
import { LoanStore, UploadLoanStartPayload } from './loan.types';

export type LoanState = {
  readonly loanItems: LoanStore[] | LoanStore[][];
  readonly isLoading: boolean;
  readonly error: Error | null;
  readonly uploadLoanError: GenerateError | AuthError | null;
  readonly uploadLoanIsLoading: boolean;
  readonly snackbarIsOpen: boolean;
};

const initialState: LoanState = {
  loanItems: [],
  isLoading: true,
  error: null,
  uploadLoanError: null,
  uploadLoanIsLoading: false,
  snackbarIsOpen: false,
};

export const loanSlice = createSlice({
  name: 'loan',
  initialState,
  reducers: {
    snackbarShown(state, _: PayloadAction<void>) {
      state.snackbarIsOpen = true;
    },
    snackbarClosed(state, _: PayloadAction<void>) {
      state.snackbarIsOpen = false;
    },
    fetchLoanStarted(state, _: PayloadAction<string>) {
      state.isLoading = true;
    },
    fetchLoansStarted(state, _: PayloadAction<void>) {
      state.isLoading = true;
    },
    fetchLoanSucceeded: {
      reducer(state, action: PayloadAction<LoanStore[]>) {
        state.loanItems = action.payload;
      },
      prepare(loan: Loan[]) {
        return {
          payload: loan.map(loanItem => ({
            ...loanItem,
            timestamp: loanItem.timestamp.toDate().toISOString(),
          })),
        };
      },
    },
    fetchLoansSucceeded: {
      reducer(state, action: PayloadAction<LoanStore[][]>) {
        state.loanItems = action.payload;
      },
      prepare(loans: Loan[][]) {
        return {
          payload: loans.map(loanArray =>
            loanArray.map(loanItem => ({
              ...loanItem,
              timestamp: loanItem.timestamp.toDate().toISOString(),
            }))
          ),
        };
      },
    },
    loanCleared(state, _: PayloadAction<void>) {
      state.loanItems = [];
      state.isLoading = true;
    },
    fetchLoanFailed(state, action: PayloadAction<Error>) {
      state.error = action.payload;
    },
    fetchLoansFailed(state, action: PayloadAction<Error>) {
      state.error = action.payload;
    },
    uploadingLoanStarted(state, _: PayloadAction<UploadLoanStartPayload>) {
      state.uploadLoanIsLoading = true;
    },
    uploadingLoanFailed(state, action: PayloadAction<Error>) {
      state.uploadLoanError = action.payload;
    },
    uploadLoanErrorMessageClosed(state, _: PayloadAction<void>) {
      state.uploadLoanError = null;
    },
    loanErrorsReset(state, _: PayloadAction<void>) {
      state.uploadLoanError = null;
      state.error = null;
    },
    loanLoadingReset(state, _: PayloadAction<void>) {
      state.uploadLoanIsLoading = false;
      state.isLoading = false;
    },
  },
});

export default loanSlice.reducer;
export const {
  fetchLoanFailed,
  fetchLoanStarted,
  fetchLoanSucceeded,
  fetchLoansFailed,
  fetchLoansStarted,
  fetchLoansSucceeded,
  loanCleared,
  loanErrorsReset,
  loanLoadingReset,
  snackbarClosed,
  snackbarShown,
  uploadLoanErrorMessageClosed,
  uploadingLoanFailed,
  uploadingLoanStarted,
} = loanSlice.actions;

export const uploadingLoanSucceeded = createAction(
  `${loanSlice.name}/uploadingLoanSucceeded`
);
