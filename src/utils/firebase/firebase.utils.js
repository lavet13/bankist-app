import { initializeApp } from 'firebase/app';

import {
  getAuth,
  signInWithRedirect,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  getRedirectResult,
} from 'firebase/auth';

import { getFirestore, getDoc, setDoc, doc } from 'firebase/firestore';

import { getStorage, ref } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyDjVb89yW2JjQPvMjxSb3PiPRc73ttErGY',
  authDomain: 'bankist-app-fd00d.firebaseapp.com',
  projectId: 'bankist-app-fd00d',
  storageBucket: 'bankist-app-fd00d.appspot.com',
  messagingSenderId: '193658985644',
  appId: '1:193658985644:web:25c3b422a5dc39467b1309',
};

const firebaseApp = initializeApp(firebaseConfig);

const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: 'select_account',
});

export const auth = getAuth();

export const signInWithGoogleRedirect = async () =>
  await signInWithRedirect(auth, googleProvider);

export const getRedirectResultFromAuth = async () =>
  await getRedirectResult(auth);

export const db = getFirestore();

// export const storage = getStorage();

export const createUserDocumentFromAuth = async (
  userAuth,
  additionalInformation = {}
) => {
  if (!userAuth) return;

  const userDocRef = doc(db, 'users', userAuth.uid);
  const userSnapshot = await getDoc(userDocRef);

  if (!userSnapshot.exists()) {
    const { displayName, email, photoURL } = userAuth;
    const createdAt = new Date();

    try {
      await setDoc(userDocRef, {
        displayName,
        email,
        createdAt,
        photoURL,
        ...additionalInformation,
      });
    } catch (error) {
      console.log('error creating the user', error.message);
    }
  }

  return userDocRef;
};

export const createAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;

  return await createUserWithEmailAndPassword(auth, email, password);
};

export const signInAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;

  return await signInWithEmailAndPassword(auth, email, password);
};

export const onAuthStateChangedListener = callback =>
  onAuthStateChanged(auth, callback);

export const signOutUser = async () => await signOut(auth);
