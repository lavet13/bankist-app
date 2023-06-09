import { AuthError } from 'firebase/auth';
import { GenerateError } from '../../common/utils/error/error.utils';

export enum TRANSFER_ERROR_CODE_TYPES {
  CREDIT_CARD_NOT_FOUND = 'transfer/credit-card-not-found',
  CANNOT_TRANSFER_YOURSELF = 'transfer/cannot-transfer-yourself',
}

type TransferErrorMessages = { [code: string]: string };

export const TRANSFER_ERROR_MESSAGES: TransferErrorMessages = {
  [TRANSFER_ERROR_CODE_TYPES.CREDIT_CARD_NOT_FOUND]:
    'Пользователя с такой кредитной картой не существует',
  [TRANSFER_ERROR_CODE_TYPES.CANNOT_TRANSFER_YOURSELF]:
    'Вы не можете передать себе деньги',
};

export const getTransferCreditCardError = (
  error: GenerateError | AuthError
) => {
  const { CREDIT_CARD_NOT_FOUND, CANNOT_TRANSFER_YOURSELF } =
    TRANSFER_ERROR_CODE_TYPES;

  switch (error.code) {
    case CREDIT_CARD_NOT_FOUND:
      return TRANSFER_ERROR_MESSAGES[CREDIT_CARD_NOT_FOUND];

    case CANNOT_TRANSFER_YOURSELF:
      return TRANSFER_ERROR_MESSAGES[CANNOT_TRANSFER_YOURSELF];

    default:
      return null;
  }
};
