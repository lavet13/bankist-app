import { createSelector } from 'reselect';

const selectMovementReducer = state => state.movement;

export const selectMovementsItems = createSelector(
  [selectMovementReducer],
  movementSlice => movementSlice.movementsItems
);

export const selectBalance = createSelector(
  [selectMovementsItems],
  movementsItems => movementsItems.reduce((acc, { value }) => acc + +value, 0)
);
