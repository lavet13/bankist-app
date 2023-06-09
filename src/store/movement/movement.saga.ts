import { takeLatest, call, all, put } from 'typed-redux-saga/macro';
import { MOVEMENT_ACTION_TYPES } from './movement.types';
import { getMovements } from '../../utils/firebase/firebase.utils';

import {
  fetchMovementsSuccess,
  fetchMovementsFailed,
  FetchMovementsStart,
} from './movement.action';

export function* fetchMovementsAsync({
  payload: { user },
}: FetchMovementsStart) {
  try {
    const movementItems = yield* call(getMovements, user);

    yield* put(fetchMovementsSuccess(movementItems));
  } catch (error: any) {
    yield* put(fetchMovementsFailed(error));
  }
}

export function* onFetchStart() {
  yield* takeLatest(
    MOVEMENT_ACTION_TYPES.FETCH_MOVEMENTS_START,
    fetchMovementsAsync
  );
}

export function* movementSagas() {
  yield all([call(onFetchStart)]);
}
