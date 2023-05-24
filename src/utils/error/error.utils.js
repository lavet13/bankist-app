export const generateErrorAndErrorCode = (errorCode, errorMessage) => {
  const error = new Error(errorMessage);
  error.code = errorCode;
  return error;
};

export const GENERAL_ERROR_CODE_TYPES = {
  NETWORK_REQUEST_FAILED: 'auth/network-request-failed',
  POPUP_BLOCKED: 'auth/popup-blocked',
};

export const GENERAL_ERROR_MESSAGES = {
  [GENERAL_ERROR_CODE_TYPES.NETWORK_REQUEST_FAILED]:
    'Ошибка сети! Это все что могу сказать!',
  [GENERAL_ERROR_CODE_TYPES.POPUP_BLOCKED]: 'Заблокирован сервером Firebase!',
};

export const getErrorMessage = error => {
  const { NETWORK_REQUEST_FAILED, POPUP_BLOCKED } = GENERAL_ERROR_CODE_TYPES;

  switch (error.code) {
    case NETWORK_REQUEST_FAILED:
      return GENERAL_ERROR_MESSAGES[NETWORK_REQUEST_FAILED];
    case POPUP_BLOCKED:
      return GENERAL_ERROR_MESSAGES[POPUP_BLOCKED];
    default:
      return `Код ошибки: ${error.code}, Сообщение: ${error.message}`;
  }
};
