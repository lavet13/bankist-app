import { combineReducers } from 'redux';

import loanSlice from '../features/loan/loan.slice';
import movementSlice from '../features/movement/movement.slice';
import transferSlice from '../features/transfer/transfer.slice';
import userProfileSlice from '../features/user-profile/user-profile.slice';
import userSlice from '../features/user/user.slice';

export const rootReducer = combineReducers({
  loan: loanSlice,
  user: userSlice,
  userProfile: userProfileSlice,
  movement: movementSlice,
  transfer: transferSlice,
});
