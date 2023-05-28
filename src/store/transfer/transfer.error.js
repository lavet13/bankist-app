export const TRANSFER_ERROR_CODE_TYPES = {
  NOT_ENOUGH_CASH: 'transfer/not-enough-cash',
  CREDIT_CARD_NOT_FOUND: 'transfer/credit-card-not-found',
  CANNOT_TRANSFER_YOURSELF: 'transfer/cannot-transfer-yourself',
  CREDIT_CARD_UNFILLED: 'transfer/credit-card-unfilled',
};

export const TRANSFER_ERROR_MESSAGES = {
  [TRANSFER_ERROR_CODE_TYPES.NOT_ENOUGH_CASH]:
    'Недостаточно средств для перевода!',
  [TRANSFER_ERROR_CODE_TYPES.CREDIT_CARD_NOT_FOUND]:
    'Пользователя с такой кредитной картой не существует',
  [TRANSFER_ERROR_CODE_TYPES.CANNOT_TRANSFER_YOURSELF]:
    'Вы не можете передать себе деньги',
  [TRANSFER_ERROR_CODE_TYPES.CREDIT_CARD_UNFILLED]:
    'Кредитная карта не заполнена!',
};

export const getTransferAmountError = error => {
  const { NOT_ENOUGH_CASH } = TRANSFER_ERROR_CODE_TYPES;

  switch (error.code) {
    case NOT_ENOUGH_CASH:
      return TRANSFER_ERROR_MESSAGES[NOT_ENOUGH_CASH];

    default:
      return null;
  }
};

export const getTransferCreditCardError = error => {
  const {
    CREDIT_CARD_NOT_FOUND,
    CANNOT_TRANSFER_YOURSELF,
    CREDIT_CARD_UNFILLED,
  } = TRANSFER_ERROR_CODE_TYPES;

  switch (error.code) {
    case CREDIT_CARD_NOT_FOUND:
      return TRANSFER_ERROR_MESSAGES[CREDIT_CARD_NOT_FOUND];

    case CANNOT_TRANSFER_YOURSELF:
      return TRANSFER_ERROR_MESSAGES[CANNOT_TRANSFER_YOURSELF];

    case CREDIT_CARD_UNFILLED:
      return TRANSFER_ERROR_MESSAGES[CREDIT_CARD_UNFILLED];

    default:
      return null;
  }
};
