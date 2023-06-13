import { UseFormReset } from 'react-hook-form';
import { UserData } from '../../common/utils/firebase/firebase.types';
import {
  FileFields,
  FormFields,
  LoanDefaultValues,
} from '../../components/loan/loan-form.component';

export type UploadLoanStartPayload = {
  currentUser: UserData;
  fileFields: FileFields;
  fields: FormFields;
  reset: UseFormReset<LoanDefaultValues>;
};
