import { eventChannel } from 'redux-saga';
import { takeLatest, call, all, put, take } from 'typed-redux-saga/macro';
import {
  fetchMovementStarted,
  fetchMovementSucceeded,
  fetchMovementFailed,
} from './movement.slice';
import { Movement, UserData } from '../../common/utils/firebase/firebase.types';
import {
  DocumentData,
  FirestoreError,
  QuerySnapshot,
  onSnapshot,
} from 'firebase/firestore';
import {
  getMovementsItems,
  getQueryMovements,
} from '../../common/utils/firebase/firebase.utils';

const isValidQuerySnapshot = (
  querySnapshot: QuerySnapshot<Movement> | FirestoreError
): querySnapshot is QuerySnapshot<Movement> =>
  !(querySnapshot as FirestoreError).code;

function createMovementsChannel(user: UserData) {
  return eventChannel<QuerySnapshot<Movement> | FirestoreError>(emitter => {
    const q = getQueryMovements(user);

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot: QuerySnapshot<DocumentData>) => {
        emitter(querySnapshot as QuerySnapshot<Movement>);
      },
      error => {
        emitter(error);
      }
    );

    return unsubscribe;
  });
}

export function* fetchMovementsAsync(
  action: {
    payload: UserData;
  } & { type: string }
) {
  const movementsChannel = yield* call(createMovementsChannel, action.payload);

  while (true) {
    try {
      const response = yield* take(movementsChannel);

      if (!isValidQuerySnapshot(response)) {
        return yield* put(fetchMovementFailed(response));
      }

      const movementItems = getMovementsItems(response);

      yield* put(fetchMovementSucceeded(movementItems));
    } catch (error: any) {
      yield* put(fetchMovementFailed(error));
      movementsChannel.close();
    }
  }
}

export function* onFetchStart() {
  yield* takeLatest(fetchMovementStarted.type, fetchMovementsAsync);
}

export function* movementSagas() {
  yield all([call(onFetchStart)]);
}
