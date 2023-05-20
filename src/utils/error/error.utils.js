export const generateErrorAndErrorCode = (errorMessage, errorCode) => {
  const error = new Error(errorMessage);
  error.code = errorCode;
  return error;
};
