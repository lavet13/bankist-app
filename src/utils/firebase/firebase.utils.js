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

import {
  getFirestore,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  doc,
  Timestamp,
  collection,
  onSnapshot,
  query,
  runTransaction,
  where,
} from 'firebase/firestore';

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

export const getGoogleRedirectResult = async () =>
  await getRedirectResult(auth);

export const db = getFirestore();

export const storage = getStorage();

export const uploadInfoForLoan = async (
  userAuth,
  formFileFields,
  formFields
) => {
  if (!userAuth) return;
  const regExp = /(?:\.([^.]+))?$/;
  const names = Object.keys(formFileFields);
  const fileNames = Object.values(formFileFields).map(
    ({ name }, idx) => `${names[idx]}.${regExp.exec(name)[1]}`
  );
  const files = Object.values(formFileFields);

  const userRef = ref(storage, `users/${userAuth.uid}`);

  const folderName = new Date();

  const timestamp = Timestamp.fromDate(folderName);

  const dateFolderRef = ref(userRef, folderName);

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

  const result = {
    folderName,
    images: await Promise.all(downloadURLs),
    timestamp,
    ...formFields,
  };

  await createUserLoanDocument(userAuth, result);
};

export const createUserLoanDocument = async (userAuth, data) => {
  if (!userAuth) return;

  const { folderName, images, timestamp, ...formFields } = data;

  const folderDocRef = doc(db, 'users', userAuth.uid, 'loans', folderName);
  const folderSnapshot = await getDoc(folderDocRef);

  if (!folderSnapshot.exists()) {
    try {
      await setDoc(folderDocRef, {
        images,
        timestamp,
        isAllowed: false,
        ...formFields,
      });
    } catch (error) {
      console.log('error creating the loan', error.message);
    }
  }

  return folderDocRef;
};

const addMovementsToUser = async (objectsToAdd, userAuth) => {
  const usersRef = collection(db, 'users');

  const sendDataPromise = objectsToAdd.map(object =>
    addDoc(collection(usersRef, userAuth.uid, 'movements'), object)
  );

  await Promise.all(sendDataPromise);

  console.log('done');
};

export const onMovementChangeListener = (userAuth, callback) => {
  const q = query(collection(db, 'users', userAuth.uid, 'movements'));
  return onSnapshot(q, callback);
};

export const transferAmountToUser = async (userAuth, email, amount) => {
  await runTransaction(db, async transaction => {
    const q = query(collection(db, 'users'), where('email', '==', email));
    const querySnapshot = await getDocs(q);
    // const userDocRef = doc(db, 'users', userAuth.uid);
    // console.log(userDocRef, querySnapshot);

    if (querySnapshot.docs[0].data().email === userAuth.email)
      return alert('Вы не можете передать себе деньги :)');

    const userDocRef = await transaction.get(querySnapshot.docs[0]);
    console.log(userDocRef);

    if (!userDocRef.exists()) {
      alert("doesn't exist");
    }
  });
};

export const getListOfFilesFromLoan = async userAuth => {
  // @FOR ADMIN
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
