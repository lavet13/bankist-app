import { USER_ACTION_TYPES } from './user.types';

export const USER_INITIAL_STATE = {
  currentUser: null,
  isLoading: true,
  emailSignInIsLoading: false,
  googleSignInIsLoading: false,
  emailSignUpIsLoading: false,
  closeAccountIsLoading: false,
  signInError: null,
  signUpError: null,
  signOutError: null,
  closeAccountError: null,
};

export const userReducer = (state = USER_INITIAL_STATE, action = {}) => {
  const { type, payload } = action;

  switch (type) {
    case USER_ACTION_TYPES.EMAIL_SIGN_IN_START:
      return { ...state, emailSignInIsLoading: true };
    case USER_ACTION_TYPES.GOOGLE_SIGN_IN_START:
      return { ...state, googleSignInIsLoading: true };
    case USER_ACTION_TYPES.SIGN_UP_START:
      return { ...state, emailSignUpIsLoading: true };
    case USER_ACTION_TYPES.CLOSE_ACCOUNT_START:
      return { ...state, closeAccountIsLoading: true };
    case USER_ACTION_TYPES.CHECK_USER_SESSION:
    case USER_ACTION_TYPES.SIGN_OUT_START:
      return { ...state, isLoading: true };
    case USER_ACTION_TYPES.SIGN_IN_SUCCESS:
      return { ...state, currentUser: payload };
    case USER_ACTION_TYPES.SIGN_OUT_SUCCESS:
      return { ...state, currentUser: null };
    case USER_ACTION_TYPES.SIGN_OUT_FAILED:
      return { ...state, signOutError: payload };
    case USER_ACTION_TYPES.SIGN_UP_FAILED:
      return { ...state, signUpError: payload };
    case USER_ACTION_TYPES.SIGN_IN_FAILED:
      return { ...state, signInError: payload };
    case USER_ACTION_TYPES.CLOSE_ACCOUNT_FAILED:
      return { ...state, closeAccountError: payload };
    case USER_ACTION_TYPES.CLOSE_SIGN_IN_ERROR_MESSAGE:
      return { ...state, signInError: null };
    case USER_ACTION_TYPES.CLOSE_SIGN_UP_ERROR_MESSAGE:
      return { ...state, signUpError: null };
    case USER_ACTION_TYPES.CLOSE_CLOSE_ACOUNT_ERROR_MESSAGE:
      return { ...state, closeAccountError: null };
    case USER_ACTION_TYPES.RESET_USER_ERRORS:
      return {
        ...state,
        signInError: null,
        signUpError: null,
        closeAccountError: null,
        signOutError: null,
      };
    case USER_ACTION_TYPES.RESET_USER_LOADING:
      return {
        ...state,
        isLoading: false,
        emailSignInIsLoading: false,
        emailSignUpIsLoading: false,
        googleSignInIsLoading: false,
        closeAccountIsLoading: false,
      };
    default:
      return state;
  }
};
