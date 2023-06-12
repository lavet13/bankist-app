import { Movement, UserData } from '../../common/utils/firebase/firebase.types';
import { AuthError } from 'firebase/auth';
import { GenerateError } from '../../common/utils/error/error.utils';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export type MovementState = {
  readonly movementsItems: Movement[];
  readonly isLoading: boolean;
  readonly error: GenerateError | AuthError | null;
};

export const initialState: MovementState = {
  movementsItems: [],
  isLoading: true,
  error: null,
};

export const movementSlice = createSlice({
  name: 'movement',
  initialState,
  reducers: {
    fetchMovementStarted(state, _: PayloadAction<UserData>) {
      state.isLoading = true;
    },
    fetchMovementSucceeded(state, action: PayloadAction<Movement[]>) {
      state.movementsItems = action.payload;
      state.isLoading = false;
    },
    fetchMovementFailed(state, action: PayloadAction<Error>) {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export default movementSlice.reducer;
export const {
  fetchMovementFailed,
  fetchMovementStarted,
  fetchMovementSucceeded,
} = movementSlice.actions;
