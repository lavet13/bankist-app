export type GenerateError = Error & { code: string };

export const generateError = (
  errorCode: string,
  errorMessage: string
): GenerateError => Object.assign(new Error(errorMessage), { code: errorCode });

export const isGenerateError = (
  error: Error | GenerateError
): error is GenerateError => (error as GenerateError).code !== undefined;

export const GENERAL_ERROR_CODE_TYPES = {
  NETWORK_REQUEST_FAILED: 'auth/network-request-failed',
  POPUP_BLOCKED: 'auth/popup-blocked',
  TOO_MANY_REQUESTS: 'auth/too-many-requests',
};

export const GENERAL_ERROR_MESSAGES = {
  [GENERAL_ERROR_CODE_TYPES.NETWORK_REQUEST_FAILED]:
    'Ошибка сети! Это все что могу сказать!',
  [GENERAL_ERROR_CODE_TYPES.POPUP_BLOCKED]: 'Заблокирован сервером Firebase!',
  [GENERAL_ERROR_CODE_TYPES.TOO_MANY_REQUESTS]:
    'Аккаунт временно заблокирован. Слишком много запросов.',
};

export const getErrorMessage = (error: any) => {
  const { NETWORK_REQUEST_FAILED, POPUP_BLOCKED, TOO_MANY_REQUESTS } =
    GENERAL_ERROR_CODE_TYPES;

  switch (error.code) {
    case NETWORK_REQUEST_FAILED:
      return GENERAL_ERROR_MESSAGES[NETWORK_REQUEST_FAILED];
    case POPUP_BLOCKED:
      return GENERAL_ERROR_MESSAGES[POPUP_BLOCKED];
    case TOO_MANY_REQUESTS:
      return GENERAL_ERROR_MESSAGES[TOO_MANY_REQUESTS];
    default:
      return `Код ошибки: ${error.code}, Сообщение: ${error.message}`;
  }
};
