import { EventChannel, eventChannel } from 'redux-saga';
import { takeLatest, call, all, put, take, fork } from 'typed-redux-saga/macro';
import {
  fetchMovementStarted,
  fetchMovementSucceeded,
  fetchMovementFailed,
  fetchMovementCancelled,
} from './movement.slice';
import { Movement } from '../../common/utils/firebase/firebase.types';
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

function createMovementsChannel(userId: string) {
  return eventChannel<QuerySnapshot<Movement> | FirestoreError>(emitter => {
    const q = getQueryMovements(userId);

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot: QuerySnapshot<DocumentData>) => {
        emitter(querySnapshot as QuerySnapshot<Movement>);
      },
      error => {
        emitter(error);
      }
    );

    return () => {
      console.log('unsubscribe');
      unsubscribe();
    };
  });
}

export function* cancelMovementsChannel(
  movementsChannel: EventChannel<QuerySnapshot<Movement> | FirestoreError>
) {
  yield* take(fetchMovementCancelled);
  movementsChannel.close();
}

export function* fetchMovementsAsync({
  payload: userId,
}: ReturnType<typeof fetchMovementStarted>) {
  const movementsChannel = yield* call(createMovementsChannel, userId);

  yield* fork(cancelMovementsChannel, movementsChannel);

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
