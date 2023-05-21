import { v4 as uuidv4 } from 'uuid';

import { initializeApp } from 'firebase/app';

import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  getRedirectResult,
  deleteUser,
} from 'firebase/auth';

import {
  getFirestore,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  doc,
  Timestamp,
  collection,
  onSnapshot,
  query,
  writeBatch,
  runTransaction,
  where,
  serverTimestamp,
  orderBy,
  updateDoc,
} from 'firebase/firestore';

import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
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
auth.useDeviceLanguage();

export const signInWithGooglePopup = async () =>
  await signInWithPopup(auth, googleProvider);

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

  const userRef = ref(storage, `users/${userAuth.id}`);

  const folderName = uuidv4();

  const timestamp = Timestamp.fromDate(new Date());

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

  return await createUserLoanDocument(userAuth, result);
};

export const createUserLoanDocument = async (userAuth, data) => {
  if (!userAuth) return;

  const { folderName, images, timestamp, ...formFields } = data;

  const folderDocRef = doc(db, 'users', userAuth.id, 'loans', folderName);
  const folderSnapshot = await getDoc(folderDocRef);

  if (!folderSnapshot.exists()) {
    try {
      await setDoc(folderDocRef, {
        images,
        timestamp,
        isAllowed: null,
        ...formFields,
      });

      return await getDoc(folderDocRef);
    } catch (error) {
      console.log('error creating the loan', error.message);
    }
  }

  return folderSnapshot;
};

export const addMovementsToUser = async (objectsToAdd, userAuth) => {
  const usersCollectionRef = collection(db, 'users');
  const batch = writeBatch(db);

  objectsToAdd.forEach(object => {
    const docRef = doc(usersCollectionRef, userAuth.id, 'movements', uuidv4());
    batch.set(docRef, object);
  });

  await batch.commit();
  console.log('done');
};

export const getMovements = userAuth => {
  return new Promise((resolve, reject) => {
    const q = query(
      collection(db, 'users', userAuth.id, 'movements'),
      orderBy('date', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      querySnapshot => {
        unsubscribe();
        resolve(querySnapshot);
      },
      reject
    );
  });
};

export const transferAmountToUser = async (userAuth, creditCard, amount) => {
  const q = query(
    collection(db, 'users'),
    where('creditCard', '==', creditCard)
  );
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.size)
    throw new Error('Пользователя с такой кредитной картой не существует');

  if (querySnapshot.docs[0].data().creditCard === userAuth.creditCard)
    throw new Error('Вы не можете передать себе деньги :)');

  const collectionUsersRef = collection(db, 'users');

  const userTransferToDocRef = doc(
    collectionUsersRef,
    querySnapshot.docs[0].id
  );
  const currentUserDocRef = doc(collectionUsersRef, userAuth.id);

  const movementDepositRef = doc(userTransferToDocRef, 'movements', uuidv4());
  const movementWithdrawalRef = doc(currentUserDocRef, 'movements', uuidv4());

  await runTransaction(db, async transaction => {
    await transaction.get(userTransferToDocRef);

    transaction.set(movementDepositRef, {
      value: amount,
      date: serverTimestamp(),
    });

    transaction.set(movementWithdrawalRef, {
      value: -amount,
      date: serverTimestamp(),
    });
  });
};

export const getAllUserLoans = async () => {
  const q = query(collection(db, 'users'));
  const querySnapshot = await getDocs(q);

  const users = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  const loanSnapshots = users.map(async user => await getUserLoans(user));
  const result = await Promise.all(loanSnapshots);

  return result.filter(loans => loans.length !== 0);
};

export const getUserLoans = async userAuth => {
  const userDocRef = doc(db, 'users', userAuth.id);
  const q = query(
    collection(userDocRef, 'loans'),
    orderBy('timestamp', 'desc')
  );

  const loanSnapshot = await getDocs(q);
  return loanSnapshot.docs.map(loanDoc => ({
    id: loanDoc.id,
    ...loanDoc.data(),
    userAuth,
  }));
};

// const generator = require('../credit-card-generator/credit-card-generator.utils');

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
        // creditCard: generator.GenCC('Mastercard', 1, Math.random)[0],
        creditCard: null,
        ...additionalInformation,
      });

      return await getDoc(userDocRef);
    } catch (error) {
      console.log('error creating the user', error.message);
    }
  }

  return userSnapshot;
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

export const getCurrentUser = () =>
  new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      user => {
        unsubscribe();
        resolve(user);
      },
      reject
    );
  });

export const isAdmin = async userAuth => {
  const adminDocRef = doc(db, 'admins', userAuth.uid);
  const adminSnapshot = await getDoc(adminDocRef);

  return { admin: adminSnapshot.exists() };
};

export const updatePermissionCreditLoan = async (userAuth, loan, flag) => {
  const userDocRef = doc(db, 'users', userAuth.id);
  const loanDocRef = doc(userDocRef, 'loans', loan.id);

  const loanSnapshot = await getDoc(loanDocRef);
  const { creditCard } = loanSnapshot.data();

  await updateDoc(userDocRef, {
    creditCard,
  });

  await updateDoc(loanDocRef, {
    isAllowed: flag,
    timestamp: serverTimestamp(),
  });
};

export const deleteUserAccount = async currentUser => {
  try {
    const userDocRef = doc(db, 'users', currentUser.uid);
    const loanCollectionRef = collection(userDocRef, 'loans');
    const movementsCollectionRef = collection(userDocRef, 'movements');

    const loanQuery = query(loanCollectionRef);
    const loanSnapshots = await getDocs(loanQuery);

    if (!loanSnapshots.empty) {
      const deletedLoanDocuments = loanSnapshots.docs.map(
        async loanSnapshot => {
          try {
            await deleteDoc(doc(loanCollectionRef, loanSnapshot.id));
            return { message: 'loan/Успешно удален' };
          } catch (error) {
            throw new Error('Ошибка при удалении документа!');
          }
        }
      );

      console.log(await Promise.all(deletedLoanDocuments));

      const listRef = ref(storage, `users/${currentUser.uid}`);
    }

    const movementsQuery = query(movementsCollectionRef);
    const movementsSnapshots = await getDocs(movementsQuery);

    if (!movementsSnapshots.empty) {
      const deletedMovementsDocuments = movementsSnapshots.docs.map(
        async movementSnapshot => {
          try {
            await deleteDoc(doc(movementsCollectionRef, movementSnapshot.id));
            return { message: 'movement/Успешно удален' };
          } catch (error) {
            throw new Error('Ошибка при удалении документа!');
          }
        }
      );

      console.log(await Promise.all(deletedMovementsDocuments));
    }

    // await deleteUser(currentUser);
  } catch (error) {
    throw error;
  }
};
