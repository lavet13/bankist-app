export const LOAN_ERROR_CODE_TYPES = {
  TELEPHONE_UNFILLED: 'loan/telephone-unfilled',
  CREDIT_CARD_UNFILLED: 'loan/CREDIT_CARD_UNFILLED',
};

export const LOAN_ERROR_MESSAGES = {
  [LOAN_ERROR_CODE_TYPES.TELEPHONE_UNFILLED]: 'Телефон не заполнен!',
  [LOAN_ERROR_CODE_TYPES.CREDIT_CARD_UNFILLED]: 'Кредитная карта не заполнена!',
};

export const getLoanFormTelephoneError = error => {
  const { TELEPHONE_UNFILLED } = LOAN_ERROR_CODE_TYPES;

  switch (error.code) {
    case TELEPHONE_UNFILLED:
      return LOAN_ERROR_MESSAGES[TELEPHONE_UNFILLED];

    default:
      return null;
  }
};

export const getLoanFormCreditCardError = error => {
  const { CREDIT_CARD_UNFILLED } = LOAN_ERROR_CODE_TYPES;

  switch (error.code) {
    case CREDIT_CARD_UNFILLED:
      return LOAN_ERROR_MESSAGES[CREDIT_CARD_UNFILLED];

    default:
      return null;
  }
};
