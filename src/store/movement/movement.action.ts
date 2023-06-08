import {
  FetchMovementsStartPayload,
  MOVEMENT_ACTION_TYPES,
} from './movement.types';
import {
  createAction,
  ActionWithPayload,
  withMatcher,
} from '../../utils/reducer/reducer.utils';
import { UserData, Movement } from '../../utils/firebase/firebase.types';

export type FetchMovementsStart = ActionWithPayload<
  MOVEMENT_ACTION_TYPES.FETCH_MOVEMENTS_START,
  FetchMovementsStartPayload
>;

export type FetchMovementsSuccess = ActionWithPayload<
  MOVEMENT_ACTION_TYPES.FETCH_MOVEMENTS_SUCCESS,
  Movement[]
>;

export type FetchMovementsFailed = ActionWithPayload<
  MOVEMENT_ACTION_TYPES.FETCH_MOVEMENTS_FAILED,
  Error
>;

export const fetchMovementsStart = withMatcher(
  (user: UserData): FetchMovementsStart =>
    createAction(MOVEMENT_ACTION_TYPES.FETCH_MOVEMENTS_START, { user })
);

export const fetchMovementsSuccess = withMatcher(
  (movementsItems: Movement[]): FetchMovementsSuccess =>
    createAction(MOVEMENT_ACTION_TYPES.FETCH_MOVEMENTS_SUCCESS, movementsItems)
);

export const fetchMovementsFailed = withMatcher(
  (error: Error): FetchMovementsFailed =>
    createAction(MOVEMENT_ACTION_TYPES.FETCH_MOVEMENTS_FAILED, error)
);
