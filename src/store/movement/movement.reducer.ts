import { AnyAction } from 'redux';
import { Movement } from '../../utils/firebase/firebase.types';
import {
  fetchMovementsFailed,
  fetchMovementsStart,
  fetchMovementsSuccess,
} from './movement.action';

export type MovementState = {
  readonly movementsItems: Movement[];
  readonly isLoading: boolean;
  readonly error: Error | null;
};

export const MOVEMENTS_INITIAL_STATE: MovementState = {
  movementsItems: [],
  isLoading: true,
  error: null,
};

export const movementReducer = (
  state = MOVEMENTS_INITIAL_STATE,
  action: AnyAction
): MovementState => {
  if (fetchMovementsStart.match(action)) {
    return { ...state, isLoading: true };
  }

  if (fetchMovementsSuccess.match(action)) {
    return { ...state, movementsItems: action.payload, isLoading: false };
  }

  if (fetchMovementsFailed.match(action)) {
    return { ...state, error: action.payload, isLoading: false };
  }

  return state;
};
