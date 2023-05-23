export const getSignInWarningMessage = error => {
  switch (error.code) {
    case 'auth/cancelled-popup-request':
      return 'Аутентификация при помощи Google была отменена!';
    case 'auth/popup-closed-by-user':
      return 'Аутентификация при помощи Google была отменена пользователем!';
    default:
      return null;
  }
};

export const getSignInEmailError = error => {
  switch (error.code) {
    case 'auth/user-not-found':
      return 'Нет пользователя ассоциированного с данным E-mail';

    case 'auth/invalid-email-validation':
      return error.message;

    default:
      return null;
  }
};

export const getSignInPasswordError = error => {
  switch (error.code) {
    case 'auth/wrong-password':
      return 'Указан неправильный пароль!';

    case 'auth/weak-password-validation':
      return error.message;

    default:
      return null;
  }
};

export const getSignUpDisplayNameError = error => {
  switch (error.code) {
    case 'auth/display-name-not-found':
      return error.message;

    default:
      return null;
  }
};

export const getSignUpEmailError = error => {
  switch (error.code) {
    case 'auth/email-already-in-use':
      return 'Уже существует аккаунт с таким E-mail';
    case 'auth/invalid-email':
      return 'Неверный формат E-mail';
    case 'auth/invalid-email-validation':
      return error.message;

    default:
      return null;
  }
};

export const getSignUpPasswordError = error => {
  switch (error.code) {
    case 'auth/wrong-password':
      return error.message;
    case 'auth/weak-password-validation':
      return error.message;
    case 'auth/weak-password':
      return 'Пароль должен составлять как минимум 6 символов';

    default:
      return null;
  }
};
