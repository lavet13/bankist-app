import { User } from 'firebase/auth';
import { UseFormReset } from 'react-hook-form';
import { CloseAccountDefaultValues } from '../../components/close-account/close-account.component';
import { AdditionalInformation } from '../../common/utils/firebase/firebase.types';

export type UserStore = {
  id: string;
  admin: boolean;
  email: string;
  createdAt: string;
  creditCard: number | null;
} & AdditionalInformation;

export type EmailSignInStartPayload = {
  email: string;
  password: string;
};

export type SignUpStartPayload = {
  email: string;
  password: string;
  confirmPassword: string;
  displayName: string;
};

export type SignUpSuccessPayload = {
  user: User;
} & AdditionalInformation;

export type CloseAccountStartPayload = {
  currentUser: User;
  password: string | null;
  reset: UseFormReset<CloseAccountDefaultValues>;
};
