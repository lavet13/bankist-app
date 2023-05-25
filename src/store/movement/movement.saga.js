import { takeLatest, call, all, put } from 'redux-saga/effects';
import { MOVEMENT_ACTION_TYPES } from './movement.types';
import { getMovements } from '../../utils/firebase/firebase.utils';

import { fetchMovementsSuccess, fetchMovementsFailed } from './movement.action';

export function* fetchMovementsAsync({ payload: { user } }) {
  try {
    const movementItems = yield call(getMovements, user);

    yield put(fetchMovementsSuccess(movementItems));
  } catch (error) {
    yield put(fetchMovementsFailed(error));
  }
}

export function* onFetchStart() {
  yield takeLatest(
    MOVEMENT_ACTION_TYPES.FETCH_MOVEMENTS_START,
    fetchMovementsAsync
  );
}

export function* movementSagas() {
  yield all([call(onFetchStart)]);
}
