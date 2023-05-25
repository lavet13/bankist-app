export const USER_ERROR_CODE_TYPES = {
  CANCELLED_POPUP_REQUEST: 'auth/cancelled-popup-request',
  POPUP_CLOSED_BY_USER: 'auth/popup-closed-by-user',
  USER_NOT_FOUND: 'auth/user-not-found',
  INVALID_EMAIL_VALIDATION: 'auth/invalid-email-validation',
  WRONG_PASSWORD: 'auth/wrong-password',
  WEAK_PASSWORD_VALIDATION: 'auth/weak-password-validation',
  DISPLAY_NAME_NOT_FOUND: 'auth/display-name-not-found',
  EMAIL_ALREADY_IN_USE: 'auth/email-already-in-use',
  INVALID_EMAIL: 'auth/invalid-email',
  WEAK_PASSWORD: 'auth/weak-password',
  MISSING_PASSWORD: 'auth/missing-password',
};

export const USER_ERROR_MESSAGES = {
  [USER_ERROR_CODE_TYPES.CANCELLED_POPUP_REQUEST]:
    'Аутентификация при помощи Google была отменена!',
  [USER_ERROR_CODE_TYPES.POPUP_CLOSED_BY_USER]:
    'Аутентификация при помощи Google была отменена пользователем!',
  [USER_ERROR_CODE_TYPES.USER_NOT_FOUND]:
    'Нет пользователя ассоциированного с данным E-mail',
  [USER_ERROR_CODE_TYPES.INVALID_EMAIL_VALIDATION]: 'Неверный формат E-mail',
  [USER_ERROR_CODE_TYPES.WRONG_PASSWORD]: 'Указан неправильный пароль!',
  [USER_ERROR_CODE_TYPES.WEAK_PASSWORD_VALIDATION]:
    'Пароль должен составлять как минимум 6 символов',
  [USER_ERROR_CODE_TYPES.DISPLAY_NAME_NOT_FOUND]:
    'Имя пользователя не было указано!',
  [USER_ERROR_CODE_TYPES.EMAIL_ALREADY_IN_USE]:
    'Уже существует аккаунт с таким E-mail',
  [USER_ERROR_CODE_TYPES.INVALID_EMAIL]: 'Неверный формат E-mail',
  [USER_ERROR_CODE_TYPES.WEAK_PASSWORD]:
    'Пароль должен составлять как минимум 6 символов',
  [USER_ERROR_CODE_TYPES.MISSING_PASSWORD]: 'Не указан пароль!',
};

export const getSignInWarningMessage = error => {
  const { CANCELLED_POPUP_REQUEST, POPUP_CLOSED_BY_USER } =
    USER_ERROR_CODE_TYPES;

  switch (error.code) {
    case CANCELLED_POPUP_REQUEST:
      return USER_ERROR_MESSAGES[CANCELLED_POPUP_REQUEST];
    case POPUP_CLOSED_BY_USER:
      return USER_ERROR_MESSAGES[POPUP_CLOSED_BY_USER];
    default:
      return null;
  }
};

export const getSignInEmailError = error => {
  const { USER_NOT_FOUND, INVALID_EMAIL_VALIDATION } = USER_ERROR_CODE_TYPES;

  switch (error.code) {
    case USER_NOT_FOUND:
      return USER_ERROR_MESSAGES[USER_NOT_FOUND];

    case INVALID_EMAIL_VALIDATION:
      return USER_ERROR_MESSAGES[INVALID_EMAIL_VALIDATION];

    default:
      return null;
  }
};

export const getSignInPasswordError = error => {
  const { WRONG_PASSWORD, WEAK_PASSWORD_VALIDATION } = USER_ERROR_CODE_TYPES;

  switch (error.code) {
    case WRONG_PASSWORD:
      return USER_ERROR_MESSAGES[WRONG_PASSWORD];

    case WEAK_PASSWORD_VALIDATION:
      return USER_ERROR_MESSAGES[WEAK_PASSWORD_VALIDATION];

    default:
      return null;
  }
};

export const getSignUpDisplayNameError = error => {
  const { DISPLAY_NAME_NOT_FOUND } = USER_ERROR_CODE_TYPES;

  switch (error.code) {
    case DISPLAY_NAME_NOT_FOUND:
      return USER_ERROR_MESSAGES[DISPLAY_NAME_NOT_FOUND];

    default:
      return null;
  }
};

export const getSignUpEmailError = error => {
  const { EMAIL_ALREADY_IN_USE, INVALID_EMAIL, INVALID_EMAIL_VALIDATION } =
    USER_ERROR_CODE_TYPES;

  switch (error.code) {
    case EMAIL_ALREADY_IN_USE:
      return USER_ERROR_MESSAGES[EMAIL_ALREADY_IN_USE];
    case USER_ERROR_CODE_TYPES[INVALID_EMAIL]:
      return USER_ERROR_MESSAGES[INVALID_EMAIL];
    case INVALID_EMAIL_VALIDATION:
      return USER_ERROR_MESSAGES[INVALID_EMAIL_VALIDATION];

    default:
      return null;
  }
};

export const getSignUpPasswordError = error => {
  const { WRONG_PASSWORD, WEAK_PASSWORD_VALIDATION, WEAK_PASSWORD } =
    USER_ERROR_CODE_TYPES;

  switch (error.code) {
    case WRONG_PASSWORD:
      return USER_ERROR_MESSAGES[WRONG_PASSWORD];
    case WEAK_PASSWORD_VALIDATION:
      return USER_ERROR_MESSAGES[WEAK_PASSWORD_VALIDATION];
    case WEAK_PASSWORD:
      return USER_ERROR_MESSAGES[WEAK_PASSWORD];

    default:
      return null;
  }
};

export const getCloseAccountPasswordError = error => {
  const { MISSING_PASSWORD, WRONG_PASSWORD } = USER_ERROR_CODE_TYPES;

  switch (error.code) {
    case MISSING_PASSWORD:
      return USER_ERROR_MESSAGES[MISSING_PASSWORD];

    case WRONG_PASSWORD:
      return USER_ERROR_MESSAGES[WRONG_PASSWORD];

    default:
      return null;
  }
};
