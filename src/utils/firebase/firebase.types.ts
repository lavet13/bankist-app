import { FieldValue } from 'firebase/firestore';

export type AdditionalInformation = {
  displayName?: string;
};

export type UserCreation = {
  email: string;
  createdAt: Date;
  creditCard: number | null;
} & AdditionalInformation;

export type UserData = {
  id: string;
  email: string;
  createdAt: Date;
  creditCard: number | null;
  admin: boolean;
} & AdditionalInformation;

export type ProvidersInfo = {
  providerId: string;
  email: string | null;
};

export type ProvidersInfoPassword = ProvidersInfo & { password: string };

export type Movement = {
  date: Date;
  value: number;
};

export type ObjectToAdd = {
  value: number;
  date: FieldValue;
};
