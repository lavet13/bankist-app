import { AuthError, AuthErrorCodes } from 'firebase/auth';
import { GenerateError } from '../../common/utils/error/error.utils';

type UserErrorMessages = { [code: string]: string };

export const USER_ERROR_MESSAGES: UserErrorMessages = {
  [AuthErrorCodes.EXPIRED_POPUP_REQUEST]:
    'Аутентификация при помощи Google была отменена!',
  [AuthErrorCodes.POPUP_CLOSED_BY_USER]:
    'Аутентификация при помощи Google была отменена пользователем!',
  [AuthErrorCodes.USER_DELETED]:
    'Нет пользователя ассоциированного с данным E-mail',
  [AuthErrorCodes.INVALID_PASSWORD]: 'Указан неправильный пароль!',
  [AuthErrorCodes.EMAIL_EXISTS]: 'Уже существует аккаунт с таким E-mail',
  [AuthErrorCodes.INVALID_EMAIL]: 'Неверный формат E-mail',
  [AuthErrorCodes.WEAK_PASSWORD]:
    'Пароль должен составлять как минимум 6 символов',
};

export const getSignInWarningMessage = (error: AuthError | GenerateError) => {
  const { EXPIRED_POPUP_REQUEST, POPUP_CLOSED_BY_USER } = AuthErrorCodes;

  switch (error.code) {
    case EXPIRED_POPUP_REQUEST:
      return USER_ERROR_MESSAGES[EXPIRED_POPUP_REQUEST];
    case POPUP_CLOSED_BY_USER:
      return USER_ERROR_MESSAGES[POPUP_CLOSED_BY_USER];
    default:
      return null;
  }
};

export const getSignInEmailError = (error: AuthError | GenerateError) => {
  const { INVALID_EMAIL, USER_DELETED } = AuthErrorCodes;

  switch (error.code) {
    case USER_DELETED:
      return USER_ERROR_MESSAGES[USER_DELETED];

    case INVALID_EMAIL:
      return USER_ERROR_MESSAGES[INVALID_EMAIL];

    default:
      return null;
  }
};

export const getSignInPasswordError = (error: AuthError | GenerateError) => {
  const { WEAK_PASSWORD, INVALID_PASSWORD } = AuthErrorCodes;

  switch (error.code) {
    case INVALID_PASSWORD:
      return USER_ERROR_MESSAGES[INVALID_PASSWORD];

    case WEAK_PASSWORD:
      return USER_ERROR_MESSAGES[WEAK_PASSWORD];

    default:
      return null;
  }
};

export const getSignUpEmailError = (error: AuthError | GenerateError) => {
  const { EMAIL_EXISTS, INVALID_EMAIL } = AuthErrorCodes;

  switch (error.code) {
    case EMAIL_EXISTS:
      return USER_ERROR_MESSAGES[EMAIL_EXISTS];

    case INVALID_EMAIL:
      return USER_ERROR_MESSAGES[INVALID_EMAIL];

    default:
      return null;
  }
};

export const getSignUpPasswordError = (error: AuthError | GenerateError) => {
  const { INVALID_PASSWORD, WEAK_PASSWORD } = AuthErrorCodes;

  switch (error.code) {
    case INVALID_PASSWORD:
      return USER_ERROR_MESSAGES[INVALID_PASSWORD];

    case WEAK_PASSWORD:
      return USER_ERROR_MESSAGES[WEAK_PASSWORD];

    default:
      return null;
  }
};

export const getCloseAccountPasswordError = (
  error: AuthError | GenerateError
) => {
  const { INVALID_PASSWORD } = AuthErrorCodes;

  switch (error.code) {
    case INVALID_PASSWORD:
      return USER_ERROR_MESSAGES[INVALID_PASSWORD];

    default:
      return null;
  }
};
