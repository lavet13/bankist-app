import { AuthError, AuthErrorCodes } from 'firebase/auth';

export type GenerateError = Error & { code?: string };

export const generateError = (
  errorCode: string,
  errorMessage: string
): GenerateError => Object.assign(new Error(errorMessage), { code: errorCode });

export const getErrorMessage = (error: AuthError | GenerateError): string => {
  const {
    NETWORK_REQUEST_FAILED,
    POPUP_BLOCKED,
    TOO_MANY_ATTEMPTS_TRY_LATER,
    USER_SIGNED_OUT,
  } = AuthErrorCodes;

  switch (error.code) {
    case NETWORK_REQUEST_FAILED:
      return 'Ошибка сети! Это все что могу сказать!';
    case POPUP_BLOCKED:
      return 'Заблокирован сервером Firebase!';
    case TOO_MANY_ATTEMPTS_TRY_LATER:
      return 'Аккаунт временно заблокирован. Слишком много запросов.';
    case USER_SIGNED_OUT:
      return 'Вышел с аккаунта!';

    default:
      return `Код ошибки: ${
        error.code ? error.code : 'Отсутствует'
      }, Сообщение: ${error.message}`;
  }
};
