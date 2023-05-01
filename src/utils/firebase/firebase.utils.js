import { initializeApp } from 'firebase/app';

import {
  getAuth,
  signInWithRedirect,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';

import { getFirestore, getDoc, setDoc, doc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDjVb89yW2JjQPvMjxSb3PiPRc73ttErGY',
  authDomain: 'bankist-app-fd00d.firebaseapp.com',
  projectId: 'bankist-app-fd00d',
  storageBucket: 'bankist-app-fd00d.appspot.com',
  messagingSenderId: '193658985644',
  appId: '1:193658985644:web:25c3b422a5dc39467b1309',
};

const firebaseApp = initializeApp(firebaseConfig);

export const db = getFirestore(firebaseApp);
