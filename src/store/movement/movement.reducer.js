import { MOVEMENT_ACTION_TYPES } from './movement.types';

export const MOVEMENTS_INITIAL_STATE = {
  movementsItems: [],
  isLoading: true,
  error: null,
};

export const movementReducer = (
  state = MOVEMENTS_INITIAL_STATE,
  action = {}
) => {
  const { type, payload } = action;

  switch (type) {
    case MOVEMENT_ACTION_TYPES.FETCH_MOVEMENTS_START:
      return { ...state, isLoading: true };

    case MOVEMENT_ACTION_TYPES.FETCH_MOVEMENTS_SUCCESS:
      return { ...state, movementsItems: payload, isLoading: false };

    case MOVEMENT_ACTION_TYPES.FETCH_MOVEMENTS_FAILED:
      return { ...state, error: payload, isLoading: false };

    default:
      return state;
  }
};
