import { Movement } from '../../common/utils/firebase/firebase.types';
import { AuthError } from 'firebase/auth';
import { GenerateError } from '../../common/utils/error/error.utils';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { MovementItemType } from './movement.types';

export type MovementState = {
  readonly movementsItems: MovementItemType[];
  readonly isLoading: boolean;
  readonly error: GenerateError | AuthError | null;
};

const initialState: MovementState = {
  movementsItems: [],
  isLoading: true,
  error: null,
};

export const movementSlice = createSlice({
  name: 'movement',
  initialState,
  reducers: {
    fetchMovementStarted(state, _: PayloadAction<string>) {
      state.isLoading = true;
    },
    fetchMovementSucceeded: {
      reducer(state, action: PayloadAction<MovementItemType[]>) {
        state.movementsItems = action.payload;
        state.isLoading = false;
      },
      prepare(movementItems: Movement[]) {
        return {
          payload: movementItems.map(({ date, ...movementProps }) => ({
            date: date.toDate().toISOString(),
            ...movementProps,
          })),
        };
      },
    },
    fetchMovementFailed(state, action: PayloadAction<Error>) {
      state.error = action.payload;
      state.isLoading = false;
    },
    fetchMovementCancelled(state, _: PayloadAction<void>) {
      state.isLoading = false;
      state.error = null;
    },
  },
});

export default movementSlice.reducer;
export const {
  fetchMovementCancelled,
  fetchMovementFailed,
  fetchMovementStarted,
  fetchMovementSucceeded,
} = movementSlice.actions;
