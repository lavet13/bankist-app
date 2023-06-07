import { User } from 'firebase/auth';
import { UseFormReset } from 'react-hook-form';
import { CloseAccountDefaultValues } from '../../components/close-account/close-account.component';
import { AdditionalInformation } from '../../utils/firebase/firebase.types';

export enum USER_ACTION_TYPES {
  CHECK_USER_SESSION = 'user/CHECK_USER_SESSION',
  EMAIL_SIGN_IN_START = 'user/EMAIL_SIGN_IN_START',
  GOOGLE_SIGN_IN_START = 'user/GOOGLE_SIGN_IN_START',
  SIGN_UP_START = 'user/SIGN_UP_START',
  SIGN_UP_SUCCESS = 'user/SIGN_UP_SUCCESS',
  SIGN_UP_FAILED = 'user/SIGN_UP_FAILED',
  SIGN_IN_SUCCESS = 'user/SIGN_IN_SUCCESS',
  SIGN_IN_FAILED = 'user/SIGN_IN_FAILED',
  SIGN_OUT_START = 'user/SIGN_OUT_START',
  SIGN_OUT_SUCCESS = 'user/SIGN_OUT_SUCCESS',
  SIGN_OUT_FAILED = 'user/SIGN_OUT_FAILED',
  CLOSE_SIGN_IN_ERROR_MESSAGE = 'user/CLOSE_SIGN_IN_ERROR_MESSAGE',
  CLOSE_SIGN_UP_ERROR_MESSAGE = 'user/CLOSE_SIGN_UP_ERROR_MESSAGE',
  CLOSE_CLOSE_ACOUNT_ERROR_MESSAGE = 'user/CLOSE_CLOSE_ACOUNT_ERROR_MESSAGE',
  CLOSE_ACCOUNT_START = 'user/CLOSE_ACCOUNT_START',
  CLOSE_ACCOUNT_SUCCESS = 'user/CLOSE_ACCOUNT_SUCCESS',
  CLOSE_ACCOUNT_FAILED = 'user/CLOSE_ACCOUNT_FAILED',
  RESET_USER_ERRORS = 'user/RESET_USER_ERRORS',
  RESET_USER_LOADING = 'user/RESET_USER_LOADING',
}

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
