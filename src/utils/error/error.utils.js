export const generateErrorAndErrorCode = (errorMessage, errorCode) => {
  const error = new Error(errorMessage);
  error.code = errorCode;
  return error;
};

export const getErrorMessage = error => {
  switch (error.code) {
    case 'auth/network-request-failed':
      return 'Ошибка сети! Это все что могу сказать!';
    case 'auth/popup-blocked':
      return 'Заблокирован сервером Firebase!';
    default:
      return `Код ошибки: ${error.code}, Сообщение: ${error.message}`;
  }
};
