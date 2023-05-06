import { combineReducers } from 'redux';

import { userReducer } from './user/user.reducer';
import { loanReducer } from './loan/loan.reducer';
import { movementReducer } from './movement/movement.reducer';

export const rootReducer = combineReducers({
  user: userReducer,
  loan: loanReducer,
  movement: movementReducer,
});
