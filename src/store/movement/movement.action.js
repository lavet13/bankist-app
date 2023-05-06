import { MOVEMENT_ACTION_TYPES } from './movement.types';
import { createAction } from '../../utils/reducer/reducer.utils';

export const setMovements = movementItems =>
  createAction(MOVEMENT_ACTION_TYPES.SET_MOVEMENTS, movementItems);
