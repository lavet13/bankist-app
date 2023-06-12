import { combineReducers } from 'redux';

import { loanReducer } from './loan/loan.reducer';
import { movementReducer } from './movement/movement.reducer';
import { transferReducer } from './transfer/transfer.reducer';
import userProfileSlice from './user-profile/user-profile.reducer';
import userSlice from './user/user.reducer';

export const rootReducer = combineReducers({
  loan: loanReducer,
  user: userSlice,
  userProfile: userProfileSlice,
  movement: movementReducer,
  transfer: transferReducer,
});
