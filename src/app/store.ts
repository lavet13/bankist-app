import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, PersistConfig } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import logger from 'redux-logger';

import { rootSaga } from './root-saga';
import { rootReducer } from './root-reducer';

import createSagaMiddleware from 'redux-saga';
import { TypedUseSelectorHook, useSelector } from 'react-redux';

const sagaMiddleware = createSagaMiddleware();

export type RootState = ReturnType<typeof rootReducer>;

type ExtendedPersistConfig = PersistConfig<RootState> & {
  whitelist: (keyof RootState)[];
};

const persistConfig: ExtendedPersistConfig = {
  key: 'root',
  storage,
  whitelist: ['userProfile'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware => {
    const middleware = getDefaultMiddleware({
      thunk: false,
      serializableCheck: false,
    }).concat(sagaMiddleware);

    if (process.env.NODE_ENV !== 'production') {
      return middleware
        .concat(logger)
        .concat(require('redux-immutable-state-invariant').default());
    }

    return middleware;
  },
  devTools: process.env.NODE_ENV !== 'production',
});

sagaMiddleware.run(rootSaga);

export const persistor = persistStore(store);

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export function withPayloadType<T>() {
  return (t: T) => ({ payload: t });
}