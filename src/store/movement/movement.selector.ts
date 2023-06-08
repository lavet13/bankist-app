import { createSelector } from 'reselect';
import { RootState } from '../store';

const selectMovementReducer = (state: RootState) => state.movement;

export const selectMovementsItems = createSelector(
  [selectMovementReducer],
  movementSlice => movementSlice.movementsItems
);

export const selectMovementsIsLoading = createSelector(
  [selectMovementReducer],
  movement => movement.isLoading
);

export const selectBalance = createSelector(
  [selectMovementsItems],
  movementsItems => movementsItems.reduce((acc, { value }) => acc + value, 0)
);
