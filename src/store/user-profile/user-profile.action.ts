import { USER_PROFILE_ACTION_TYPES } from './user-profile.types';
import {
  createAction,
  ActionWithPayload,
  withMatcher,
} from '../../utils/reducer/reducer.utils';

export type ToogleUserDropdown = ActionWithPayload<
  USER_PROFILE_ACTION_TYPES.SET_USER_DROPDOWN_IS_OPEN,
  boolean
>;

export const toggleUserDropdown = withMatcher(
  (boolean: boolean): ToogleUserDropdown =>
    createAction(USER_PROFILE_ACTION_TYPES.SET_USER_DROPDOWN_IS_OPEN, boolean)
);
