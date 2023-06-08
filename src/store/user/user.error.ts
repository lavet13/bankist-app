export enum USER_ERROR_CODE_TYPES {
  CANCELLED_POPUP_REQUEST = 'auth/cancelled-popup-request',
  POPUP_CLOSED_BY_USER = 'auth/popup-closed-by-user',
  USER_NOT_FOUND = 'auth/user-not-found',
  WRONG_PASSWORD = 'auth/wrong-password',
  EMAIL_ALREADY_IN_USE = 'auth/email-already-in-use',
  INVALID_EMAIL = 'auth/invalid-email',
  WEAK_PASSWORD = 'auth/weak-password',
}

type UserErrorMessages = { [code: string]: string };

export const USER_ERROR_MESSAGES: UserErrorMessages = {
  [USER_ERROR_CODE_TYPES.CANCELLED_POPUP_REQUEST]:
    'Аутентификация при помощи Google была отменена!',
  [USER_ERROR_CODE_TYPES.POPUP_CLOSED_BY_USER]:
    'Аутентификация при помощи Google была отменена пользователем!',
  [USER_ERROR_CODE_TYPES.USER_NOT_FOUND]:
    'Нет пользователя ассоциированного с данным E-mail',
  [USER_ERROR_CODE_TYPES.WRONG_PASSWORD]: 'Указан неправильный пароль!',
  [USER_ERROR_CODE_TYPES.EMAIL_ALREADY_IN_USE]:
    'Уже существует аккаунт с таким E-mail',
  [USER_ERROR_CODE_TYPES.INVALID_EMAIL]: 'Неверный формат E-mail',
  [USER_ERROR_CODE_TYPES.WEAK_PASSWORD]:
    'Пароль должен составлять как минимум 6 символов',
};

export const getSignInWarningMessage = (error: any) => {
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

export const getSignInEmailError = (error: any) => {
  const { USER_NOT_FOUND, INVALID_EMAIL } = USER_ERROR_CODE_TYPES;

  switch (error.code) {
    case USER_NOT_FOUND:
      return USER_ERROR_MESSAGES[USER_NOT_FOUND];

    case INVALID_EMAIL:
      return USER_ERROR_MESSAGES[INVALID_EMAIL];

    default:
      return null;
  }
};

export const getSignInPasswordError = (error: any) => {
  const { WRONG_PASSWORD, WEAK_PASSWORD } = USER_ERROR_CODE_TYPES;

  switch (error.code) {
    case WRONG_PASSWORD:
      return USER_ERROR_MESSAGES[WRONG_PASSWORD];

    case WEAK_PASSWORD:
      return USER_ERROR_MESSAGES[WEAK_PASSWORD];

    default:
      return null;
  }
};

export const getSignUpEmailError = (error: any) => {
  const { EMAIL_ALREADY_IN_USE, INVALID_EMAIL } = USER_ERROR_CODE_TYPES;

  switch (error.code) {
    case EMAIL_ALREADY_IN_USE:
      return USER_ERROR_MESSAGES[EMAIL_ALREADY_IN_USE];

    case INVALID_EMAIL:
      return USER_ERROR_MESSAGES[INVALID_EMAIL];

    default:
      return null;
  }
};

export const getSignUpPasswordError = (error: any) => {
  const { WRONG_PASSWORD, WEAK_PASSWORD } = USER_ERROR_CODE_TYPES;

  switch (error.code) {
    case WRONG_PASSWORD:
      return USER_ERROR_MESSAGES[WRONG_PASSWORD];
    case WEAK_PASSWORD:
      return USER_ERROR_MESSAGES[WEAK_PASSWORD];

    default:
      return null;
  }
};

export const getCloseAccountPasswordError = (error: any) => {
  const { WRONG_PASSWORD } = USER_ERROR_CODE_TYPES;

  switch (error.code) {
    case WRONG_PASSWORD:
      return USER_ERROR_MESSAGES[WRONG_PASSWORD];

    default:
      return null;
  }
};
