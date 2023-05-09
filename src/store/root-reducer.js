import { combineReducers } from 'redux';

import { userReducer } from './user/user.reducer';
import { loanReducer } from './loan/loan.reducer';
import { movementReducer } from './movement/movement.reducer';
import { userProfileReducer } from './user-profile/user-profile.reducer';

export const rootReducer = combineReducers({
  user: userReducer,
  userProfile: userProfileReducer,
  loan: loanReducer,
  movement: movementReducer,
});
