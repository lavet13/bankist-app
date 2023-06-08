import { combineReducers } from 'redux';

import { userReducer } from './user/user.reducer';
import { loanReducer } from './loan/loan.reducer';
import { movementReducer } from './movement/movement.reducer';
import { userProfileReducer } from './user-profile/user-profile.reducer';
import { transferReducer } from './transfer/transfer.reducer';

export const rootReducer = combineReducers({
  loan: loanReducer,
  user: userReducer,
  userProfile: userProfileReducer,
  movement: movementReducer,
  transfer: transferReducer,
});
