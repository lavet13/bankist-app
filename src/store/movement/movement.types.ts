import { UserData } from '../../utils/firebase/firebase.types';

export enum MOVEMENT_ACTION_TYPES {
  FETCH_MOVEMENTS_START = 'movement/FETCH_MOVEMENTS_START',
  FETCH_MOVEMENTS_SUCCESS = 'movement/FETCH_MOVEMENTS_SUCCESS',
  FETCH_MOVEMENTS_FAILED = 'movement/FETCH_MOVEMENTS_FAILED',
}

export type FetchMovementsStartPayload = {
  user: UserData;
};
