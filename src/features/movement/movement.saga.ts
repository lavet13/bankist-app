import { takeLatest, call, all, put } from 'typed-redux-saga/macro';
import {
  fetchMovementStarted,
  fetchMovementSucceeded,
  fetchMovementFailed,
} from './movement.slice';
import { getMovements } from '../../common/utils/firebase/firebase.utils';
import { UserData } from '../../common/utils/firebase/firebase.types';

export function* fetchMovementsAsync(
  action: {
    payload: UserData;
  } & { type: string }
) {
  try {
    const movementItems = yield* call(getMovements, action.payload);

    yield* put(fetchMovementSucceeded(movementItems));
  } catch (error: any) {
    yield* put(fetchMovementFailed(error));
  }
}

export function* onFetchStart() {
  yield* takeLatest(fetchMovementStarted.type, fetchMovementsAsync);
}

export function* movementSagas() {
  yield all([call(onFetchStart)]);
}
