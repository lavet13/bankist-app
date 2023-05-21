import { USER_ACTION_TYPES } from './user.types';

export const USER_INITIAL_STATE = {
  currentUser: null,
  isLoading: true,
  emailSignInIsLoading: false,
  googleSignInIsLoading: false,
  emailSignUpIsLoading: false,
  closeAccountIsLoading: false,
  error: null,
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
    case USER_ACTION_TYPES.SIGN_UP_SUCCESS:
      return { ...state, error: null, emailSignUpIsLoading: true };
    case USER_ACTION_TYPES.SIGN_IN_SUCCESS:
      return {
        ...state,
        currentUser: payload,
        isLoading: false,
        error: null,
        emailSignInIsLoading: false,
        googleSignInIsLoading: false,
      };
    case USER_ACTION_TYPES.SIGN_OUT_SUCCESS:
      return { ...state, currentUser: null, isLoading: false };
    case USER_ACTION_TYPES.CLOSE_ACCOUNT_SUCCESS:
      return { ...state, closeAccountIsLoading: false };
    case USER_ACTION_TYPES.SIGN_OUT_FAILED:
    case USER_ACTION_TYPES.SIGN_UP_FAILED:
      return { ...state, error: payload, emailSignUpIsLoading: false };
    case USER_ACTION_TYPES.SIGN_IN_FAILED:
      return {
        ...state,
        error: payload,
        isLoading: false,
        emailSignInIsLoading: false,
        emailSignUpIsLoading: false,
        googleSignInIsLoading: false,
      };
    case USER_ACTION_TYPES.CLOSE_ACCOUNT_FAILED:
      return { ...state, error: payload, closeAccountIsLoading: false };
    case USER_ACTION_TYPES.CLOSE_ERROR_MESSAGE:
      return { ...state, error: null };
    default:
      return state;
  }
};
