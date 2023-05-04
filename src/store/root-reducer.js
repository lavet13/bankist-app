import { combineReducers } from 'redux';

import { userReducer } from './user/user.reducer';
import { loanReducer } from './loan/loan.reducer';

export const rootReducer = combineReducers({
  user: userReducer,
  loan: loanReducer,
});
