import { MOVEMENT_ACTION_TYPES } from './movement.types';
import { createAction } from '../../utils/reducer/reducer.utils';

export const setMovements = movementItems =>
  createAction(MOVEMENT_ACTION_TYPES.SET_MOVEMENTS, movementItems);

export const fetchMovementsStart = user =>
  createAction(MOVEMENT_ACTION_TYPES.FETCH_MOVEMENTS_START, { user });

export const fetchMovementsSuccess = movementsItems =>
  createAction(MOVEMENT_ACTION_TYPES.FETCH_MOVEMENTS_SUCCESS, movementsItems);

export const fetchMovementsFailed = error =>
  createAction(MOVEMENT_ACTION_TYPES.FETCH_MOVEMENTS_FAILED, error);
