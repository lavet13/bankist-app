export const getTransferAmountError = error => {
  switch (error.code) {
    case 'transfer/not-enough-cash':
      return error.message;

    default:
      return null;
  }
};

export const getTransferCreditCardError = error => {
  switch (error.code) {
    case 'transfer/credit-card-not-found':
      return error.message;

    case 'transfer/cannot-transfer-yourself':
      return error.message;

    default:
      return null;
  }
};
