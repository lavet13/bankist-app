import { UseFormReset } from 'react-hook-form';
import {
  FileFields,
  FormFields,
  LoanDefaultValues,
} from '../../components/loan/loan-form.component';

export type LoanStore = {
  id: string;
  creditCard: string;
  displayName: string;
  email: string;
  images: string[];
  amount: number;
  isAllowed: boolean;
  tel: string;
  timestamp: string;
  userId: string;
};

export type UploadLoanStartPayload = {
  userId: string;
  fileFields: FileFields;
  fields: FormFields;
  reset: UseFormReset<LoanDefaultValues>;
};
