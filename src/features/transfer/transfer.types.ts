import { UseFormReset } from 'react-hook-form';
import { TransferDefaultValues } from '../../components/transfer/transfer.component';
import { UserData } from '../../common/utils/firebase/firebase.types';

export type TransferStartPayload = {
  currentUser: UserData | null;
  reset: UseFormReset<TransferDefaultValues>;
} & TransferDefaultValues;
