import { MOVEMENT_ACTION_TYPES } from './movement.types';

export const MOVEMENTS_INITIAL_STATE = {
  movementsItems: [],
};

export const movementReducer = (
  state = MOVEMENTS_INITIAL_STATE,
  action = {}
) => {
  const { type, payload } = action;

  switch (type) {
    case MOVEMENT_ACTION_TYPES.SET_MOVEMENTS:
      return { ...state, movementsItems: payload };
    default:
      return state;
  }
};
