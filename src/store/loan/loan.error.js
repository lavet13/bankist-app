export const LOAN_ERROR_CODE_TYPES = {
  DISPLAY_NAME_UNFILLED: 'loan/display-name-unfilled',
  TELEPHONE_UNFILLED: 'loan/telephone-unfilled',
  CREDIT_CARD_UNFILLED: 'loan/credit-card-unfilled',
  INVALID_EMAIL_VALIDATION: 'loan/invalid-email-validation',
  AMOUNT_IS_ZERO: 'loan/amount-is-zero',
  PASSPORT_IS_UNFILLED: 'loan/passport-is-unfilled',
  EMPLOYMENT_IS_UNFILLED: 'loan/employment-is-unfilled',
  FINANCIALS_IS_UNFILLED: 'loan/financials-is-unfilled',
  COLLATERAL_IS_UNFILLED: 'loan/collateral-is-unfilled',
};

export const LOAN_ERROR_MESSAGES = {
  [LOAN_ERROR_CODE_TYPES.TELEPHONE_UNFILLED]: 'Телефон не заполнен!',
  [LOAN_ERROR_CODE_TYPES.CREDIT_CARD_UNFILLED]: 'Кредитная карта не заполнена!',
  [LOAN_ERROR_CODE_TYPES.DISPLAY_NAME_UNFILLED]:
    'Имя пользователя не заполнено!',
  [LOAN_ERROR_CODE_TYPES.INVALID_EMAIL_VALIDATION]: 'Неверный формат E-mail',
  [LOAN_ERROR_CODE_TYPES.AMOUNT_IS_ZERO]: 'Сумма должна быть больше нуля',
  [LOAN_ERROR_CODE_TYPES.PASSPORT_IS_UNFILLED]: 'Паспорт не заполнен!',
  [LOAN_ERROR_CODE_TYPES.EMPLOYMENT_IS_UNFILLED]: 'Не заполнен!',
  [LOAN_ERROR_CODE_TYPES.FINANCIALS_IS_UNFILLED]: 'Не заполнен!',
  [LOAN_ERROR_CODE_TYPES.COLLATERAL_IS_UNFILLED]: 'Не заполнен!',
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

export const getLoanFormDisplayNameError = error => {
  const { DISPLAY_NAME_UNFILLED } = LOAN_ERROR_CODE_TYPES;

  switch (error.code) {
    case DISPLAY_NAME_UNFILLED:
      return LOAN_ERROR_MESSAGES[DISPLAY_NAME_UNFILLED];

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

export const getLoanFormEmailError = error => {
  const { INVALID_EMAIL_VALIDATION } = LOAN_ERROR_CODE_TYPES;
  switch (error.code) {
    case INVALID_EMAIL_VALIDATION:
      return LOAN_ERROR_MESSAGES[INVALID_EMAIL_VALIDATION];
    default:
      return null;
  }
};

export const getLoanFormAmountError = error => {
  const { AMOUNT_IS_ZERO } = LOAN_ERROR_CODE_TYPES;

  switch (error.code) {
    case AMOUNT_IS_ZERO:
      return LOAN_ERROR_MESSAGES[AMOUNT_IS_ZERO];

    default:
      return null;
  }
};

export const getLoanFormPassportPhotoError = error => {
  const { PASSPORT_IS_UNFILLED } = LOAN_ERROR_CODE_TYPES;

  switch (error.code) {
    case PASSPORT_IS_UNFILLED:
      return LOAN_ERROR_MESSAGES[PASSPORT_IS_UNFILLED];

    default:
      return null;
  }
};

export const getLoanFormEmploymentError = error => {
  const { EMPLOYMENT_IS_UNFILLED } = LOAN_ERROR_CODE_TYPES;

  switch (error.code) {
    case EMPLOYMENT_IS_UNFILLED:
      return LOAN_ERROR_MESSAGES[EMPLOYMENT_IS_UNFILLED];

    default:
      return null;
  }
};

export const getLoanFormFinancialsError = error => {
  const { FINANCIALS_IS_UNFILLED } = LOAN_ERROR_CODE_TYPES;

  switch (error.code) {
    case FINANCIALS_IS_UNFILLED:
      return LOAN_ERROR_MESSAGES[FINANCIALS_IS_UNFILLED];

    default:
      return null;
  }
};

export const getLoanFormCollateralError = error => {
  const { COLLATERAL_IS_UNFILLED } = LOAN_ERROR_CODE_TYPES;

  switch (error.code) {
    case COLLATERAL_IS_UNFILLED:
      return LOAN_ERROR_MESSAGES[COLLATERAL_IS_UNFILLED];

    default:
      return null;
  }
};
