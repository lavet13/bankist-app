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

import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  list,
  listAll,
} from 'firebase/storage';

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

export const storage = getStorage();

export const uploadInfoForLoan = async (userAuth, formFileFields) => {
  const regExp = /(?:\.([^.]+))?$/;
  const names = Object.keys(formFileFields);
  const fileNames = Object.values(formFileFields).map(
    ({ name }, idx) => `${names[idx]}.${regExp.exec(name)[1]}`
  );
  const files = Object.values(formFileFields);

  const userRef = ref(storage, `users/${userAuth.uid}`);

  const dateFolderRef = ref(
    userRef,
    Intl.DateTimeFormat('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format()
  );

  const loadFiles = files.map(async (file, idx) => {
    const snapshot = await uploadBytesResumable(
      ref(dateFolderRef, fileNames[idx]),
      file
    );

    return snapshot;
  });
  const snapshots = await Promise.all(loadFiles);

  const downloadURLs = snapshots.map(
    async snapshot => await getDownloadURL(snapshot.ref)
  );

  return await Promise.all(downloadURLs);
};

export const getListOfFilesFromLoan = async userAuth => {
  // @RECURSIVE FUNCTION: INCOMPLETE
  const listRef = ref(storage, `users/${userAuth.uid}`);

  const fetchFolders = await list(listRef, { maxResults: 100 });

  const result = fetchFolders.prefixes.reduce(async (acc, folderRef) => {
    const filesRef = await listAll(folderRef);

    const fetchFiles = filesRef.items.map(
      async itemRef => await getDownloadURL(itemRef)
    );

    const files = await Promise.all(fetchFiles);

    return [...acc, { [folderRef.name]: files }];
  }, []);

  return result;
};

export const createUserDocumentFromAuth = async (
  userAuth,
  additionalInformation = {}
) => {
  if (!userAuth) return;

  const userDocRef = doc(db, 'users', userAuth.uid);
  const userSnapshot = await getDoc(userDocRef);

  if (!userSnapshot.exists()) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();

    try {
      await setDoc(userDocRef, {
        displayName,
        email,
        createdAt,
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
