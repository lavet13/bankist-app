import { UseFormReset } from 'react-hook-form';
import { TransferDefaultValues } from '../../components/transfer/transfer.component';
import { UserStore } from '../user/user.types';

export type TransferStartPayload = {
  currentUser: UserStore | null;
  reset: UseFormReset<TransferDefaultValues>;
} & TransferDefaultValues;
