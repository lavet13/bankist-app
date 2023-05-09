import { USER_PROFILE_ACTION_TYPES } from './user-profile.types';

export const USER_PROFILE_INITIAL_STATE = {
  isUserDropdownOpen: false,
};

export const userProfileReducer = (
  state = USER_PROFILE_INITIAL_STATE,
  action = {}
) => {
  const { type, payload } = action;

  switch (type) {
    case USER_PROFILE_ACTION_TYPES.SET_USER_DROPDOWN_IS_OPEN:
      return { ...state, isUserDropdownOpen: payload };
    default:
      return state;
  }
};
