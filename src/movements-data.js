import { serverTimestamp } from 'firebase/firestore';

export const MOVEMENTS_DATA = [
  {
    value: 100,
    date: serverTimestamp(),
  },
  {
    value: 300,
    date: serverTimestamp(),
  },
  {
    value: 400,
    date: serverTimestamp(),
  },
  {
    value: -200,
    date: serverTimestamp(),
  },
  {
    value: -100,
    date: serverTimestamp(),
  },
];
