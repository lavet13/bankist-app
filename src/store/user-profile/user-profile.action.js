import { USER_PROFILE_ACTION_TYPES } from './user-profile.types';
import { createAction } from '../../utils/reducer/reducer.utils';

export const toggleUserDropdown = boolean =>
  createAction(USER_PROFILE_ACTION_TYPES.SET_USER_DROPDOWN_IS_OPEN, boolean);
