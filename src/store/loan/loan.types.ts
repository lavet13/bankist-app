import { UseFormReset } from 'react-hook-form';
import { UserData } from '../../utils/firebase/firebase.types';
import {
  FileFields,
  FormFields,
  LoanDefaultValues,
} from '../../components/loan/loan-form.component';

export enum LOAN_ACTION_TYPES {
  FETCH_LOAN_START = 'loan/FETCH_LOAN_START',
  FETCH_LOAN_SUCCESS = 'loan/FETCH_LOAN_SUCCESS',
  FETCH_LOAN_FAILED = 'loan/FETCH_LOAN_FAILED',
  FETCH_LOANS_START = 'loan/FETCH_LOANS_START',
  FETCH_LOANS_SUCCESS = 'loan/FETCH_LOANS_SUCCESS',
  FETCH_LOANS_FAILED = 'loan/FETCH_LOANS_FAILED',
  UPLOAD_LOAN_START = 'loan/UPLOAD_LOAN_START',
  UPLOAD_LOAN_SUCCESS = 'loan/UPLOAD_LOAN_SUCCESS',
  UPLOAD_LOAN_FAILED = 'loan/UPLOAD_LOAN_FAILED',
  CLOSE_UPLOAD_LOAN_ERROR_MESSAGE = 'loan/CLOSE_UPLOAD_LOAN_ERROR_MESSAGE',
  SHOW_SNACKBAR = 'loan/SHOW_SNACKBAR',
  CLOSE_SNACKBAR = 'loan/CLOSE_SNACKBAR',
  RESET_LOAN_ERRORS = 'loan/RESET_LOAN_ERRORS',
  RESET_LOAN_LOADING = 'loan/RESET_LOAN_LOADING',
  CLEAR_LOAN = 'loan/CLEAR_LOAN',
}

export type UploadLoanStartPayload = {
  currentUser: UserData;
  fileFields: FileFields;
  fields: FormFields;
  reset: UseFormReset<LoanDefaultValues>;
};
