import { FieldValue, Timestamp } from 'firebase/firestore';

export type AdditionalInformation = {
  displayName?: string;
};

export type UserData = {
  id: string;
  admin: boolean;
  email: string;
  createdAt: Timestamp;
  creditCard: number | null;
} & AdditionalInformation;

export type ProvidersInfo = {
  providerId: string;
  email: string | null;
};

export type ProvidersInfoPassword = ProvidersInfo & { password: string };

export type Movement = {
  date: Timestamp;
  value: number;
};

export type Loan = {
  id: string;
  creditCard: string;
  displayName: string;
  email: string;
  images: string[];
  amount: number;
  isAllowed: boolean;
  tel: string;
  timestamp: Timestamp;
  userId: string;
};

export type ObjectToAdd = {
  value: number;
  date: FieldValue;
};
